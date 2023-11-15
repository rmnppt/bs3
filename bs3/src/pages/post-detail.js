import * as React from 'react';
import { useLoaderData } from "react-router-dom";
import BasicCard from '../components/post-card';
import { useSelector } from 'react-redux'
import MainActionFab from '../components/main-action-buttons';

export function idLoader({ params }) {
  return params.postId;
}

function Post() {
  var postId = useLoaderData();
  const post = useSelector(state => state.app.posts.find(post => post.id === postId))

  return (
    <div>
      <BasicCard post={post} extended={true}></BasicCard>
        <MainActionFab type="back"></MainActionFab>
    </div>
  )
}

export default Post;