import * as React from "react";
import { useLoaderData } from "react-router-dom";
import BasicCard from "../components/post-card";
import { useSelector } from "react-redux";
import MainActionFab from "../components/main-action-buttons";
import { PostData } from "../types/types";
import { RootState } from "../app/store";
import type { LoaderFunction } from '@remix-run/router';

// Define the argument shape for the loader function
interface LoaderArgs {
  params: {
    postId?: string;
  };
}

// Loader function that retrieves the post ID
export const idLoader: LoaderFunction = ({ params }: LoaderArgs) => {
  if (!params.postId) {
    throw new Response("Post ID not found", { status: 404 });
  }
  return params.postId;
};

function Post(): JSX.Element {
  const postId = useLoaderData() as string;
  const post = useSelector((state: RootState) =>
    state.app.posts.find((item) => item.id === postId)
  );

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div>
      <BasicCard post={post} extended={true} />
      <MainActionFab type="back" />
    </div>
  );
}

export default Post;