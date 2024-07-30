import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { CardActionArea, Stack } from '@mui/material';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { upVotePost, downVotePost, sortPosts } from '../app/firestoreSlice';
import { useState } from 'react'

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
  
  const userId = useSelector(state => state.app.user)
  const location = useSelector(state => state.geolocation.location)
  
  const [thisPost, setThisPost] = useState({
    userUpVoted: post.upVoted.includes(userId),
    userDownVoted: post.downVoted.includes(userId)
  })

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
    post = {...post, body: post.body.slice(0, 75) + "..."}
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
    <Card sx={{ minWidth: 275, maxHeight: 275, my: 2, mx: 2, wordBreak: "break-word"}}>
      <CardContent>
        <Stack direction="row">
            <CardActions sx={{ pl: 0, ml: 0}}>
              <Stack direction="column">
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
              <Typography variant="body2">
                {post.body}
              </Typography>
          </CardActionArea>
          </ConditionalLink>
        </Stack>
      </CardContent>
    </Card>
  );
}