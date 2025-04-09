import React, { useState, MouseEvent } from "react";
import BasicCard from "../components/post-card";
import Button from '@mui/material/Button';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useLocation, Link } from 'react-router-dom';
import MainActionFab from "../components/main-action-buttons";
import PullToRefresh from 'react-simple-pull-to-refresh';
import { fetchPosts, sortPosts } from "../app/firestoreSlice";
import { PostData } from "../types/types";
import { RootState } from "../app/store";
import { useAppDispatch, useAppSelector } from "../app/hooks";

// Props for the PostList class component
interface PostListProps {
  posts: PostData[];
}

class PostList extends React.Component<PostListProps> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(props: PostListProps) {
    super(props);
  }

  render() {
    return this.props.posts.map((p) => (
      <div key={p.id}>
        <BasicCard 
          // className="BasicCard"
          post={p}
          extended={false}
        />
      </div>
    ));
  }
}

interface SnackBarState {
  open: boolean;
  postId: string | null;
}

// PostListPage component
export default function PostListPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state: RootState) => state.app.posts);
  const location = useLocation();
  let snackBar: SnackBarState = { open: false, postId: null };

  if (location.state !== null) {
    const { postId } = (location.state as { postId?: string }) || {};
    snackBar = {
      open: !!postId,
      postId: postId || null
    };
    window.history.replaceState({}, document.title);
  }

  const handleRefresh = () => {
    return new Promise<void>((resolve) => {
      dispatch(fetchPosts());
      dispatch(sortPosts());
      resolve();
    });
  };

  return (
    <div>
      <MainActionFab type="new" />
      <PullToRefresh
        onRefresh={() => handleRefresh()}
        pullingContent={
          <div style={{ textAlign: 'center', padding: '10px' }}>
            <RefreshIcon fontSize="large" color="secondary" />
          </div>
        }
        refreshingContent={
          <div style={{ textAlign: 'center', padding: '10px' }}>
            <RefreshIcon fontSize="large" className="spin" color="secondary" />
          </div>
        }
      >
        <PostList posts={posts} />
      </PullToRefresh>
      <SimpleSnackbar snackbar={snackBar} />
    </div>
  );
}

// Props for SimpleSnackbar
interface SimpleSnackbarProps {
  snackbar: SnackBarState;
}

function SimpleSnackbar({ snackbar }: SimpleSnackbarProps): JSX.Element {
  const [snack, setSnack] = useState<SnackBarState>({
    open: snackbar.open,
    postId: snackbar.postId
  });

  const handleClose = (
    event: Event | React.SyntheticEvent<any, Event>,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnack({ ...snack, open: false });
  };

  const action = (
    <>
      <Button 
        color="secondary" 
        size="small" 
        component={Link} 
        to={`p/${snack.postId}`}
      >
        VIEW
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <div>
      <Snackbar
        open={snack.open}
        sx={{ bottom: { xs: 100, sm: 0 } }}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Post submitted"
        action={action}
      />
    </div>
  );
}