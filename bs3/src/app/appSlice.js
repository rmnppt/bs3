import { createSlice } from '@reduxjs/toolkit'
import { posts } from '../api/post'
import { nanoid } from 'nanoid'

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

export const appSlice = createSlice({
  
    name: 'app',
  
    initialState: {
        user: loadOrCreateId("userId", nanoid(10)),
        posts: posts,
    },
  
    reducers: {
  
        addPost: (state, action) => {
            state.posts.push(action.payload)
        },
    
        upVote: (state, action) => {
            const postIndex = state.posts.findIndex((p => p.id === action.payload));
            state.posts[postIndex].upVotes += 1
            state.posts[postIndex].upVoted.push(state.user)
        },
    
        downVote: (state, action) => {
            const postIndex = state.posts.findIndex((p => p.id === action.payload));
            state.posts[postIndex].downVotes += 1
            state.posts[postIndex].downVoted.push(state.user)
        },

        sortPosts: (state) => {
            state.posts.sort((a, b) => rankingScore(b.upVotes, b.downVotes) - rankingScore(a.upVotes, a.downVotes) )
        }
  
    }

})

// Action creators are generated for each case reducer function
export const { addPost, upVote, downVote, sortPosts } = appSlice.actions

export default appSlice.reducer