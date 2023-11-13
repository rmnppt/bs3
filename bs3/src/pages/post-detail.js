import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useLoaderData } from "react-router-dom";
import MainActionFab from '../components/main-action-buttons';
import { useOutletContext } from "react-router-dom";

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
      <Paper sx={{ my: 2, mx: 2, py: 2, px: 2}}>
          <Stack direction="row" spacing={1}>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {post.author}
          </Typography>
          <Chip label={post.tag} size="small" color="primary" variant="outlined"></Chip>
          </Stack>
          <Typography variant="h5" component="div">
            {post.title}
          </Typography> 
          <Typography variant="body2">
            {post.body}
          </Typography>
      </Paper>
      <MainActionFab type="back"/>
    </div>
  )
}

export default Post;