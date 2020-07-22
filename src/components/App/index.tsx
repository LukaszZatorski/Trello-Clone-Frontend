import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import './index.css';
import LogIn from '../LogIn';
import LogOut from '../LogOut';
import SignUp from '../SignUp';
import Landing from '../Landing';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(
    sessionStorage.getItem('loggedIn') === 'true' || false,
  );

  return (
    <Router>
      <div className=''>
        <nav className='flex p-2 text-white font-bold justify-between bg-blue-700'>
          <Link to='/'>Main Page</Link>
          <Link className='opacity-75' to='/'>
            Trello Clone
          </Link>
          <div>
            {loggedIn ? (
              <LogOut setLoggedIn={setLoggedIn} />
            ) : (
              <React.Fragment>
                <Link className='mr-4' to='/login'>
                  Log in
                </Link>
                <Link to='/signup'>Sign Up</Link>
              </React.Fragment>
            )}
          </div>
        </nav>
        <div>
          <Route exact path='/'>
            <Landing loggedIn={loggedIn}></Landing>
          </Route>
          <Route path='/login'>
            {loggedIn ? (
              <Redirect to='/' />
            ) : (
              <LogIn setLoggedIn={setLoggedIn}></LogIn>
            )}
          </Route>
          <Route path='/signup'>
            <SignUp setLoggedIn={setLoggedIn}></SignUp>
          </Route>
        </div>
      </div>
    </Router>
  );
};

export default App;
