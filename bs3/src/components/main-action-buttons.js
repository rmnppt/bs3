import { styled } from '@mui/material/styles';
import Fab from '@mui/material/Fab';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { submitPost } from '../api/post';

const StyledFab = styled(Fab)({
    position: 'fixed',
    zIndex: 1300,
    bottom: 30,
    left: 0,
    right: 0,
    margin: '0 auto',
  });

export default function MainActionFab({ type, clickHandler }) {
    switch(type) {
        
        case type = "new":
            return (
                <StyledFab color="secondary" aria-label="add" component={ Link } to={"/new"}>
                  <AddIcon />
                </StyledFab>
            )

        case type = "submit":
            return (
                <StyledFab color="secondary" aria-label="send" type="submit" onClick={clickHandler} component={ Link } to={"/"}>
                  <SendIcon />
                </StyledFab>
            )

        case type = "back":
            return (
                <StyledFab color="secondary" aria-label="back" component={ Link } to={"/"}>
                  <ArrowBackIcon />
                </StyledFab>
            )
        default:


    }
}