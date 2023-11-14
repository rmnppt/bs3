import { createSlice } from '@reduxjs/toolkit'
import { posts } from '../api/post'

export const postsSlice = createSlice({
  
    name: 'posts',
  
    initialState: posts,
  
    reducers: {
  
        addPost: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.push(action.payload)
        },
    
        upVote: (state, action) => {
            const postIndex = state.value.findIndex((p => p.id === action.payload));
            state[postIndex].upVote += 1
        },
    
        downVote: (state, action) => {
            const postIndex = state.value.findIndex((p => p.id === action.payload));
            state[postIndex].downVote += 1
        }
  
    }

})

// Action creators are generated for each case reducer function
export const { addPost, upVote, downVote } = postsSlice.actions

export default postsSlice.reducer