import './App.css';
import CardList from './components/post-list';
import BottomAppBar from './components/bottom-app-bar';

function App() {
  return (
    <div className="App">
      <CardList></CardList>          
      <BottomAppBar></BottomAppBar>
    </div>
  );
}

export default App;
