import './App.css';
import { posts as postList } from './api/post';
import { useState } from 'react';
import BottomAppBar from './components/bottom-app-bar';
import { Outlet } from 'react-router-dom';

function App() {
  const [posts, setPosts] = useState(postList);

  return (
    <div className="App">
      <Outlet context={[posts, setPosts]}/>
      <BottomAppBar></BottomAppBar>
    </div>
  );
}

export default App;
