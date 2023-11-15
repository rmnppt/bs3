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

            let downVoted = state.posts[postIndex].downVoted
            if ( downVoted.includes(state.user) ) {
                downVoted = downVoted.filter((id) => id !== state.user)
                state.posts[postIndex].downVoted = downVoted
            }
            
            let upVoted = state.posts[postIndex].upVoted
            if ( !upVoted.includes(state.user) ) {
                upVoted.push(state.user)
                state.posts[postIndex].upVoted = upVoted
            }
        },
    
        downVote: (state, action) => {
            const postIndex = state.posts.findIndex((p => p.id === action.payload));
            
            let upVoted = state.posts[postIndex].upVoted
            if ( upVoted.includes(state.user) ) {
                upVoted = upVoted.filter((id) => id !== state.user)
                state.posts[postIndex].upVoted = upVoted
            }
            
            let downVoted = state.posts[postIndex].downVoted
            if ( !downVoted.includes(state.user) ) {
                downVoted.push(state.user)
                state.posts[postIndex].downVoted = downVoted
            }
        },

        sortPosts: (state) => {
            state.posts.sort((a, b) => rankingScore(b.upVoted.length, b.downVoted.length) - rankingScore(a.upVoted.length, a.downVoted.length) )
        }
  
    }

})

// Action creators are generated for each case reducer function
export const { addPost, upVote, downVote, sortPosts } = appSlice.actions

export default appSlice.reducer