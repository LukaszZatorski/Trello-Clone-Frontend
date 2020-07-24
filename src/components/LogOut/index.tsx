import React from 'react';
import apiClient from '../../services/apiClient';

type LogOutProps = {
  setLoggedIn: (x: boolean) => void;
};

const LogOut = ({ setLoggedIn }: LogOutProps) => {
  const logout = () => {
    apiClient.post('/logout').then((response) => {
      if (response.status === 204) {
        setLoggedIn(false);
        sessionStorage.removeItem('loggedIn');
        sessionStorage.removeItem('email');
      }
    });
  };
  return <button onClick={logout}>Logout</button>;
};

export default LogOut;
