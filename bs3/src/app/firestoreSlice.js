import { nanoid } from 'nanoid'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, arrayRemove, arrayUnion, getDoc } from "firebase/firestore";
import { db } from '../api/firebaseConfig';

function rankingScore(upVotes, downVotes) {
    const score = (upVotes / downVotes) * upVotes
    return score
}

function loadOrCreateId(key, defaultValue) {
    const item = localStorage.getItem(key)
    if (item) {
        return item
    } else {
        localStorage.setItem(key, defaultValue)
        return defaultValue
    }
}

export const fetchPosts = createAsyncThunk(
  'firestore/fetchPosts',
  async () => {
    const querySnapshot = await getDocs(collection(db, 'posts'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
);

export const upVotePost = createAsyncThunk(
  'firestore/upVote',
  async ({ id, user }) => {
    
    const post = doc(db, 'posts', id);
    
    await updateDoc(post, {
      upVoted: arrayUnion(user),
      downVoted: arrayRemove(user)
    });

    const updatedPost = (await getDoc(post)).data()
    return updatedPost 
  }
);

export const downVotePost = createAsyncThunk(
  'firestore/downVote',
  async ({ id, user }) => {

    const post = doc(db, 'posts', id);
    
    await updateDoc(post, {
      upVoted: arrayRemove(user),
      downVoted: arrayUnion(user)
    });

    const updatedPost = (await getDoc(post)).data()
    return updatedPost
  }
);

export const insertPost = createAsyncThunk(
  'firestore/insertPost',
  async (data) => {
    const docRef = await addDoc(collection(db, 'posts'), data);
    return { id: docRef.id, ...data };
  }
);

export const updatePost = createAsyncThunk(
  'firestore/updatePost',
  async ({ id, data }) => {
    const docRef = doc(db, 'posts', id);
    const serialised_data = JSON.parse(JSON.stringify(data))
    await updateDoc(docRef, serialised_data);
    return { id, ...data };
  }
);

export const deletePost = createAsyncThunk(
  'firestore/deletePost',
  async (id) => {
    const docRef = doc(db, 'posts', id);
    await deleteDoc(docRef);
    return id;
  }
);

const firestoreSlice = createSlice({

  name: 'firestore',
  
  initialState: {
    user: loadOrCreateId("userId", nanoid(10)),
    posts: [],
    status: 'idle',
    error: null
  },
  
  reducers: {
    sortPosts: (state) => {
        state.posts.sort((a, b) => rankingScore(b.upVoted.length, b.downVoted.length) - rankingScore(a.upVoted.length, a.downVoted.length) )
    }
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(insertPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      })
      .addCase(upVotePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(doc => doc.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(downVotePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(doc => doc.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(doc => doc.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(doc => doc.id !== action.payload);
      });
  }
});

export const { addPost, sortPosts } = firestoreSlice.actions

export default firestoreSlice.reducer;
