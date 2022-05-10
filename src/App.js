import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import Home from './Components/Home';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/login' element={<Login></Login>}></Route>
      </Routes>
    </div>
  );
}

export default App;
