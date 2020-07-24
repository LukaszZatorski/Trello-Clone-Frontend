import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
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

type User = {
  id: number;
  username: string;
  name: string;
  email: string;
};

const App = () => {
  const [loggedIn, setLoggedIn] = useState(
    sessionStorage.getItem('loggedIn') === 'true' || false,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    if (loggedIn) {
      apiClient
        .get(`/api/users/${sessionStorage.getItem('email')}`)
        .then((response) => {
          setUser(response.data);
          setIsLoading(false);
        })
        .catch((error) => console.error(error));
    }
  }, [loggedIn]);

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
              <div className='flex'>
                <div className='mr-2'>{!isLoading ? user!.name : null}</div>
                <LogOut setLoggedIn={setLoggedIn} />
              </div>
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
            {loggedIn ? (
              <Redirect to='/' />
            ) : (
              <SignUp setLoggedIn={setLoggedIn}></SignUp>
            )}
          </Route>
        </div>
      </div>
    </Router>
  );
};

export default App;
