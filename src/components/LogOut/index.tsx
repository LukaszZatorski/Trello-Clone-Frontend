import React from 'react';
import apiClient from '../../services/apiClient';
import { useHistory } from 'react-router-dom';

type LogOutProps = {
  setLoggedIn: (x: boolean) => void;
};

const LogOut = ({ setLoggedIn }: LogOutProps) => {
  let history = useHistory();
  const logout = () => {
    apiClient.post('/logout').then((response) => {
      if (response.status === 204) {
        setLoggedIn(false);
        sessionStorage.removeItem('loggedIn');
        sessionStorage.removeItem('email');
        history.push('/');
      }
    });
  };
  return <button onClick={logout}>Logout</button>;
};

export default LogOut;
