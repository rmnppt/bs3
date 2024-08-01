import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { CardActionArea, Stack, IconButton, Modal, Box } from '@mui/material';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { upVotePost, downVotePost, sortPosts } from '../app/firestoreSlice';
import { useState } from 'react'
import ReactMarkdown from 'react-markdown';
import { deletePost } from '../app/firestoreSlice';

function ConditionalLink({ children, condition, ...props }) {
  return !!condition && props.to ? 
    <Link 
      {...props} 
      style={{textDecoration: 'none', color: "inherit"}}
    >
      {children}
    </Link> : <>{children}</>
}



export default function BasicCard({ post, extended = false}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const userId = useSelector(state => state.app.user)
  const location = useSelector(state => state.geolocation.location)
  const [deleteWarningOpen, setDeleteWarningOpen] = useState(false);
  
  const [thisPost, setThisPost] = useState({
    userUpVoted: post.upVoted.includes(userId),
    userDownVoted: post.downVoted.includes(userId)
  })
  
  const handleEdit = () => {
    localStorage.setItem('newPostForm', JSON.stringify(post));
    navigate("/new")
  };

  const handleDelete = () => {
    setDeleteWarningOpen(true)
  };
  
  const handleConfirmDelete = () => {
    dispatch(deletePost(post.id))
    navigate("/")
    setDeleteWarningOpen(false)
  }

  const handleClose = () => {
    setDeleteWarningOpen(false);
  };

  function setUpVoted() {
    setThisPost({
      userUpVoted: true,
      userDownVoted: false
    })
  }

  function setDownVoted() {
    setThisPost({
      userUpVoted: false,
      userDownVoted: true
    })
  }

  if (extended === false) {
    post = {...post, body: post.body.replace(/\n/g, ' ').slice(0, 75) + "..."}
  }
  
  function handleUpVote() {
    dispatch(upVotePost({ id: post.id, user: userId}))
    dispatch(sortPosts())
    setUpVoted()
  }

  function handleDownVote() {
    dispatch(downVotePost({ id: post.id, user: userId}))
    dispatch(sortPosts()) 
    setDownVoted()
  }
  
  return (
    <Card sx={{ 
      minWidth: 275, 
      maxHeight: 275, 
      my: 2, 
      mx: 2, 
      wordBreak: "break-word",
      border: post.userId === userId ? '1px solid' : 'none', 
      borderColor: 'secondary.main' }}>
      <CardContent>
        {post.userId === userId && extended && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={handleEdit}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
            <Modal
              open={deleteWarningOpen}
              onClose={handleClose}
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
            >
              <Box sx={{ p: 4, bgcolor: 'background.paper', boxShadow: 24, borderRadius: 1 }}>
                <Typography id="modal-title" variant="h6" component="h2">
                  Confirm Delete
                </Typography>
                <Typography id="modal-description" sx={{ mt: 2 }}>
                  Are you sure you want to delete this post? This action cannot be undone.
                </Typography>
                <Button onClick={handleClose} color="primary" sx={{ mt: 2 }}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmDelete} color="secondary" sx={{ mt: 2, ml: 2 }}>
                  Delete
                </Button>
              </Box>
            </Modal>
          </div>
        )}
        <Stack direction="row" alignItems="flex-start">
          <CardActions sx={{ pl: 0, ml: 0}}>
            <Stack direction="column" alignItems="flex-start">
              <Button onClick={handleUpVote} disabled={!location.local}>
                <Stack direction="column">
                  <Typography 
                    color={location.local ? "primary" : "disabled"} 
                    fontSize={11} 
                    textAlign={"center"}>
                      {post.upVoted.length}
                  </Typography>
                  <ArrowCircleUpIcon 
                    color={thisPost.userUpVoted ? "primary" : "disabled"}>
                  </ArrowCircleUpIcon>
                </Stack>
              </Button>
              <Button onClick={handleDownVote} disabled={!location.local}>
                <Stack direction="column">
                <ArrowCircleDownIcon 
                  color={thisPost.userDownVoted ? "secondary" : "disabled"}>
                </ArrowCircleDownIcon>
                <Typography 
                  color={location.local ? "secondary" : "disabled"} 
                  fontSize={11} 
                  textAlign={"center"}>
                    {post.downVoted.length}
                </Typography>
                </Stack>
              </Button>
            </Stack>
          </CardActions>
          <ConditionalLink condition={!extended} to={`p/${post.id}`}>
            <CardActionArea>
              <Stack direction="row" spacing={1}>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                {post.author}
              </Typography>
              <Chip label={`#${post.tag}`} 
                size="small" 
                color="primary" 
                variant="outlined" 
                sx={{ 
                backgroundColor: 'transparent', 
                border: 'none', 
                color: 'primary.main' 
              }} />
              </Stack>
              <Typography variant="h5" component="div">
                {post.title}
              </Typography> 
              <ReactMarkdown>
                {post.body}
              </ReactMarkdown>
            </CardActionArea>
          </ConditionalLink>
        </Stack>
      </CardContent>
    </Card>
  );
}