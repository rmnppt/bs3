import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';
import PropTypes from 'prop-types';


function HideOnScroll(props) {
    const { children } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger();
  
    return (
      <Slide appear={false} direction="up" in={!trigger}>
        {children}
      </Slide>
    );
  }

HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired,
  };

export default function BottomAppBar() {
    return (
      <React.Fragment>
        <CssBaseline />
            <HideOnScroll>
                <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
                    <Toolbar>
                        <IconButton color="inherit" aria-label="open drawer">
                          <MenuIcon />
                        </IconButton>
                        {/* <StyledFab color="secondary" aria-label="add" component={ Link } to={"new"}>
                          <AddIcon />
                        </StyledFab> */}
                        <Box sx={{ flexGrow: 1 }} />
                        <IconButton color="inherit">
                          <SearchIcon />
                        </IconButton>
                        <IconButton color="inherit">
                          <MoreIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
            </HideOnScroll>
      </React.Fragment>
    );
  }