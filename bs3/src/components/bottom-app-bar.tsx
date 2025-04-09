import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CrossIcon from '@mui/icons-material/Close';

// Define the props for the HideOnScroll component
interface HideOnScrollProps {
  children: React.ReactElement;
}

function HideOnScroll(props: HideOnScrollProps): JSX.Element {
  const { children } = props;
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

// Define the types for the Redux state
interface AppState {
  app: {
    user: string;
  };
  geolocation: {
    location: {
      local: boolean;
    };
  };
}

export default function BottomAppBar(): JSX.Element {
  const user = useSelector((state: AppState) => state.app.user);
  const location = useSelector((state: AppState) => state.geolocation.location);

  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll>
        <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
          <Toolbar>
            <IconButton color="inherit" aria-label="open drawer">
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
              <Typography variant="caption" sx={{ marginBottom: 0, marginTop: 2 }}>
                User ID - {user}
              </Typography>
              <br />
              {location.local ? (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography
                    textAlign="right"
                    variant="caption"
                    sx={{ marginBottom: 0, marginTop: 0 }}
                  >
                    Local mode
                    <CheckIcon
                      sx={{
                        fontSize: 'inherit',
                        lineHeight: 'inherit',
                        verticalAlign: 'middle',
                      }}
                    />
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography
                    textAlign="right"
                    variant="caption"
                    sx={{ marginBottom: 0, marginTop: 0 }}
                  >
                    Guest mode
                    <CrossIcon
                      sx={{
                        fontSize: 'inherit',
                        lineHeight: 'inherit',
                        verticalAlign: 'middle',
                      }}
                    />
                  </Typography>
                </Box>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
    </React.Fragment>
  );
}