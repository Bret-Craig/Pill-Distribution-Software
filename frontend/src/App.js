import React, {useState} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from "./Login";
import SignUp from "./SignUp";
import Calendar from './Calendar'; 

function App() {

  const [user, setUser] = useState(
    {
      username: '',
      name: ''
    }
  );

  return (
    <div className='container'>
      <BrowserRouter>
        <Routes>
          <Route
            path='/' element={ <Login setUser = {setUser} user = {user}/> }
          />
          <Route
            path='/signup' element={ <SignUp setUser = {setUser}/> }
          />
          <Route
            path='/meds' element={ <Calendar /> }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
