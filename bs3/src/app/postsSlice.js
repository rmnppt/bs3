import { createSlice } from '@reduxjs/toolkit'
import { posts } from '../api/post'

export const postsSlice = createSlice({
  
    name: 'posts',
  
    initialState: posts,
  
    reducers: {
  
        addPost: (state, action) => {
            state.push(action.payload)
        },
    
        upVote: (state, action) => {
            const postIndex = state.findIndex((p => p.id === action.payload));
            state[postIndex].upVotes += 1
        },
    
        downVote: (state, action) => {
            const postIndex = state.findIndex((p => p.id === action.payload));
            state[postIndex].downVotes += 1
        }
  
    }

})

// Action creators are generated for each case reducer function
export const { addPost, upVote, downVote } = postsSlice.actions

export default postsSlice.reducer