import './App.css';
import BottomAppBar from './components/bottom-app-bar';
import { Outlet } from 'react-router-dom';

function App() {

  return (
    <div className="App">
      <Outlet />
      <BottomAppBar></BottomAppBar>
    </div>
  );
}

export default App;
