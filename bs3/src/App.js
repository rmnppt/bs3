import './App.css';
import BottomAppBar from './components/bottom-app-bar';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

const StyledFab = styled(Fab)({
  position: 'fixed',
  zIndex: 1300,
  bottom: 30,
  left: 0,
  right: 0,
  margin: '0 auto',
});

function App() {
  return (
    <div className="App">
      <Outlet />
      <StyledFab color="secondary" aria-label="add" component={ Link } to={"new"}>
        <AddIcon />
      </StyledFab>
      <BottomAppBar></BottomAppBar>
    </div>
  );
}

export default App;
