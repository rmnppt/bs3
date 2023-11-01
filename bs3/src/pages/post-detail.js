import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';


function Post({post}) {
    return (
        <Paper>
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
    )
}

export default Post;