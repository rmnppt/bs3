import { styled } from '@mui/material/styles';
import Fab from '@mui/material/Fab';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const StyledFab = styled(Fab)({
    position: 'fixed',
    zIndex: 1300,
    bottom: 30,
    left: 0,
    right: 0,
    margin: '0 auto',
});

interface MainActionFabProps {
    type: 'new' | 'submit' | 'back';
}

export default function MainActionFab({ type }: MainActionFabProps): JSX.Element | null {
    switch (type) {
        case 'new':
            return (
                <Link to="/new" style={{ textDecoration: 'none' }}>
                    <StyledFab color="secondary" aria-label="add">
                        <AddIcon />
                    </StyledFab>
                </Link>
            );

        case 'submit':
            return (
                <StyledFab color="secondary" aria-label="send" type="submit">
                    <SendIcon />
                </StyledFab>
            );

        case 'back':
            return (
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <StyledFab color="secondary" aria-label="back">
                        <ArrowBackIcon />
                    </StyledFab>
                </Link>
            );

        default:
            return null;
    }
}
