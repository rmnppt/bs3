import { nanoid } from 'nanoid'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, arrayRemove, arrayUnion, getDoc } from "firebase/firestore";
import { db } from '../api/firebaseConfig';
import { PostData, FirestoreState } from '../types/types';

const USER_ID_KEY = 'userId';

function loadOrCreateId(key: string, defaultValue: string): string {
  const item = localStorage.getItem(key);
  if (item) {
    return item;
  } else {
    localStorage.setItem(key, defaultValue);
    return defaultValue;
  }
}

const initialState: FirestoreState = {
  user: loadOrCreateId(USER_ID_KEY, nanoid(10)),
  posts: [],
  status: 'idle',
  error: null,
};

function rankingScore(upVotes: number, downVotes: number): number {
  const n = upVotes + downVotes;
  if (n === 0) return -1;

  const z = 1.96; // 1.96 for a 95% confidence interval
  const phat = upVotes / n;

  const score = (phat + z * z / (2 * n) - z * Math.sqrt((phat * (1 - phat) + z * z / (4 * n)) / n)) / (1 + z * z / n);
  return score;
}

function sortPostsByRanking(posts: PostData[]): PostData[] {
  return posts.sort(
    (a, b) =>
      rankingScore(b.upVoted.length, b.downVoted.length) -
      rankingScore(a.upVoted.length, a.downVoted.length)
  );
}

// Fix typings for fetchPosts
export const fetchPosts = createAsyncThunk<PostData[]>(
  'firestore/fetchPosts',
  async () => {
    const querySnapshot = await getDocs(collection(db, 'posts'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PostData));
  }
);

// Fix typings for upVotePost
export const upVotePost = createAsyncThunk<PostData, { id: string; user: string }>(
  'firestore/upVote',
  async ({ id, user }) => {
    const post = doc(db, 'posts', id);
    await updateDoc(post, {
      upVoted: arrayUnion(user),
      downVoted: arrayRemove(user),
    });

    const updatedPost = (await getDoc(post)).data();
    return { id, ...updatedPost } as PostData;
  }
);

// Fix typings for downVotePost
export const downVotePost = createAsyncThunk<PostData, { id: string; user: string }>(
  'firestore/downVote',
  async ({ id, user }) => {
    const post = doc(db, 'posts', id);
    await updateDoc(post, {
      upVoted: arrayRemove(user),
      downVoted: arrayUnion(user),
    });

    const updatedPost = (await getDoc(post)).data();
    return { id, ...updatedPost } as PostData;
  }
);

// Fix typings for insertPost
export const insertPost = createAsyncThunk<PostData, Omit<PostData, 'id'>>(
  'firestore/insertPost',
  async (data) => {
    const docRef = await addDoc(collection(db, 'posts'), data);
    return { id: docRef.id, ...data };
  }
);

// Fix typings for updatePost
export const updatePost = createAsyncThunk<PostData, { id: string; data: Partial<PostData> }>(
  'firestore/updatePost',
  async ({ id, data }) => {
    const docRef = doc(db, 'posts', id);
    const serialised_data = JSON.parse(JSON.stringify(data));
    await updateDoc(docRef, serialised_data);
    return { id, ...data } as PostData;
  }
);

// Fix typings for deletePost
export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (id: string) => {
    try {
      const docRef = doc(db, 'posts', id);
      await deleteDoc(docRef);
      return id;
    } catch (error) {
      console.error("Error deleting document: ", error);
      return id
    }
  }
);

const firestoreSlice = createSlice({
  name: 'firestore',
  initialState,
  reducers: {
    sortPosts: (state) => {
      state.posts.sort(
        (a, b) =>
          rankingScore(b.upVoted.length, b.downVoted.length) -
          rankingScore(a.upVoted.length, a.downVoted.length)
      );
    },
    addPost: (state, action) => {
      state.posts.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = sortPostsByRanking(action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(insertPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      })
      .addCase(upVotePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex((doc) => doc.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(downVotePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex((doc) => doc.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex((doc) => doc.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((doc) => doc.id !== action.payload);
      });
  },
});

export const { addPost, sortPosts } = firestoreSlice.actions;

export default firestoreSlice.reducer;
