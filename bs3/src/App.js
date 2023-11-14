import './App.css';
import BottomAppBar from './components/bottom-app-bar';
import { Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store'

function App() {

  return (
    <Provider store={store}>
      <div className="App">
        <Outlet />
        <BottomAppBar></BottomAppBar>
      </div>
    </Provider>
  );
}

export default App;
