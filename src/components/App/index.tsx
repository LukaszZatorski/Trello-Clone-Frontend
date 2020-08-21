import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import PrivateRoute from '../../services/privateRoute';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch,
} from 'react-router-dom';
import './index.css';
import LogIn from '../LogIn';
import LogOut from '../LogOut';
import SignUp from '../SignUp';
import Landing from '../Landing';
import Boards from '../Boards';
import Board from '../Board';

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
  const [navColor, setNavColor] = useState('bg-blue-700');

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
      <div className='min-h-screen flex flex-col'>
        <nav
          className={`flex p-2 text-white font-bold justify-between ${navColor}`}
        >
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
        <div className='flex flex-col flex-1'>
          <Switch>
            <Route exact path='/'>
              <Landing loggedIn={loggedIn}></Landing>
            </Route>
            <Route path='/login'>
              <LogIn setLoggedIn={setLoggedIn}></LogIn>
            </Route>
            <Route path='/signup'>
              {loggedIn ? (
                <Redirect to='/' />
              ) : (
                <SignUp setLoggedIn={setLoggedIn}></SignUp>
              )}
            </Route>
            <Route path='/boards/:id'>
              {({ match }) => (
                <Board
                  setNavColor={setNavColor}
                  boardId={match?.params.id}
                ></Board>
              )}
            </Route>
            <PrivateRoute path='/boards'>
              <Boards></Boards>
            </PrivateRoute>
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
