import React from "react";
import BasicCard from "../components/post-card";
import MainActionFab from "../components/main-action-buttons";
import { useOutletContext } from "react-router-dom";
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useLocation, Link } from 'react-router-dom';
import { useState } from "react";

class PostList extends React.Component {
    constructor(posts) {
        super()
    }
    
    render() {
        
        return this.props.posts.map(p => {
            return (
                <div key={p.id}>
                    <BasicCard 
                        className="BasicCard"
                        post={p}
                        ></BasicCard>
                </div>
            )
        })
    }
}

export default function PostListPage() {
    const [posts] = useOutletContext();
    const location = useLocation();
    var snackBar = {
        open: false,
        postId: null
    }

    if (location.state !== null) {
        snackBar = {
            open: true,
            postId: location.state.postId
        }
        window.history.replaceState({}, document.title)
    }

    return (
        <div>
            <MainActionFab type="new" />
            <PostList posts={posts}/>
            <SimpleSnackbar snackbar={snackBar} />
        </div>
    )
}


function SimpleSnackbar(snackbar) {
  const [snack, setSnack] = useState({
    open: snackbar.snackbar.open,
    postId: snackbar.snackbar.postId
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnack({...snack, ...{open: false}});
  };

  const action = (
    <React.Fragment>
      <Button 
        color="secondary" 
        size="small" 
        component={Link} 
        to={`p/${snack.postId}`}>
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
    </React.Fragment>
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
      >
    </Snackbar>
    </div>
  );
}