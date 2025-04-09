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
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { upVotePost, downVotePost, sortPosts, deletePost } from '../app/firestoreSlice';
import { useState } from 'react'
import ReactMarkdown from 'react-markdown';
import { PostData } from '../types/types';

// Define types for ConditionalLink props
interface ConditionalLinkProps {
  children: React.ReactNode;
  condition: boolean;
  to: string;
  [key: string]: any; // Allow additional props
}

function ConditionalLink({ children, condition, ...props }: ConditionalLinkProps) {
  return !!condition && props.to ? (
    <Link {...props} style={{ textDecoration: 'none', color: 'inherit' }}>
      {children}
    </Link>
  ) : (
    <>{children}</>
  );
}

interface BasicCardProps {
  post: PostData;
  extended?: boolean;
}

interface ThisPostState {
  userUpVoted: boolean;
  userDownVoted: boolean;
}

export default function BasicCard({ post, extended = false }: BasicCardProps) {
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [deleteWarningOpen, setDeleteWarningOpen] = useState<boolean>(false);

  const userId = useAppSelector(state => state.app.user);
  const location = useAppSelector(state => state.geolocation.location);

  const [thisPost, setThisPost] = useState<ThisPostState>({
    userUpVoted: post.upVoted.includes(userId),
    userDownVoted: post.downVoted.includes(userId),
  });

  const handleEdit = () => {
    localStorage.setItem('newPostForm', JSON.stringify(post));
    navigate('/new');
  };

  const handleDelete = () => {
    setDeleteWarningOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deletePost(post.id));
    navigate('/');
    setDeleteWarningOpen(false);
  };

  const handleClose = () => {
    setDeleteWarningOpen(false);
  };

  const setUpVoted = () => {
    setThisPost({
      userUpVoted: true,
      userDownVoted: false,
    });
  };

  const setDownVoted = () => {
    setThisPost({
      userUpVoted: false,
      userDownVoted: true,
    });
  };

  if (!extended) {
    post = { ...post, body: post.body.replace(/\n/g, ' ').slice(0, 75) + '...' };
  }

  const handleUpVote = () => {
    dispatch(upVotePost({ id: post.id, user: userId }));
    dispatch(sortPosts());
    setUpVoted();
  };

  const handleDownVote = () => {
    dispatch(downVotePost({ id: post.id, user: userId }));
    dispatch(sortPosts());
    setDownVoted();
  };

  return (
    <Card
      sx={{
        minWidth: 275,
        maxHeight: extended ? 'none' : 275,
        my: 2,
        mx: 2,
        wordBreak: 'break-word',
        border: post.userId === userId ? '1px solid' : 'none',
        borderColor: 'secondary.main',
      }}
    >
      <CardContent
        sx={{
          my: 0,
          mx: 0,
          padding: 1,
          paddingBottom: 0,
          margin: 0,
          marginBottom: 0,
          gutterBottom: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {timeAgo(post.timestamp)}
          </Typography>
        </Box>
        <Stack
          direction="row"
          alignItems="flex-start"
          sx={{
            my: 0,
            mx: 0,
            padding: 1,
            paddingBottom: 0,
          }}
        >
          <CardActions sx={{ pl: 0, ml: 0 }}>
            <Stack direction="column" alignItems="flex-start" spacing={0.5}>
              <Button
                onClick={handleUpVote}
                disabled={!location.local}
                sx={{ minWidth: 'auto', padding: '4px' }}
              >
                <Stack direction="column" spacing={0.5}>
                  <Typography
                    color={location.local ? 'primary' : 'disabled'}
                    fontSize={11}
                    textAlign={'center'}
                  >
                    {post.upVoted.length}
                  </Typography>
                  <ArrowCircleUpIcon
                    color={thisPost.userUpVoted ? 'primary' : 'disabled'}
                    fontSize="small"
                  />
                </Stack>
              </Button>
              <Button
                onClick={handleDownVote}
                disabled={!location.local}
                sx={{ minWidth: 'auto', padding: '4px' }}
              >
                <Stack direction="column" spacing={0.5}>
                  <ArrowCircleDownIcon
                    color={thisPost.userDownVoted ? 'secondary' : 'disabled'}
                    fontSize="small"
                  />
                  <Typography
                    color={location.local ? 'secondary' : 'disabled'}
                    fontSize={11}
                    textAlign={'center'}
                  >
                    {post.downVoted.length}
                  </Typography>
                </Stack>
              </Button>
            </Stack>
          </CardActions>
          <ConditionalLink condition={!extended} to={`p/${post.id}`} sx={{ width: '100%' }}>
            <CardActionArea>
              <Stack direction="row" spacing={1}>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  {post.author}
                </Typography>
                <Chip
                  label={`#${post.tag}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'primary.main',
                  }}
                />
              </Stack>
              <Typography variant="h5" component="div">
                {post.title}
              </Typography>
              <ReactMarkdown>{post.body}</ReactMarkdown>
            </CardActionArea>
          </ConditionalLink>
        </Stack>
      </CardContent>
    </Card>
  );
}

// Helper function for timeAgo
function timeAgo(timestamp: string): string {
  const now = new Date();
  const postDate = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}