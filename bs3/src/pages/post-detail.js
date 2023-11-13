import * as React from 'react';
import { useLoaderData } from "react-router-dom";
import MainActionFab from '../components/main-action-buttons';
import { useOutletContext } from "react-router-dom";
import BasicCard from '../components/post-card';

export function idLoader({ params }) {
  return params.postId;
}

function Post() {
  const [posts] = useOutletContext();
  var postId = useLoaderData();

  function getPost(postId) {
    var post = posts.find(p => p.id === postId);
    return post;
  }

  const post = getPost(postId)
  
  return (
    <div>
      <BasicCard post={post} extended={true}></BasicCard>
      <MainActionFab type="back"/>
    </div>

  )
}

export default Post;