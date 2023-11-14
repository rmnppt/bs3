import * as React from 'react';
import { useLoaderData } from "react-router-dom";
import MainActionFab from '../components/main-action-buttons';
import BasicCard from '../components/post-card';
import { useSelector } from 'react-redux'

export function idLoader({ params }) {
  return params.postId;
}

function Post() {
  var postId = useLoaderData();
  const post = useSelector(state => state.posts.find(post => post.id === postId))

  return (
    <div>
      <BasicCard post={post} extended={true}></BasicCard>
      <MainActionFab type="back"/>
    </div>

  )
}

export default Post;