import React, { useState, SyntheticEvent } from 'react';
import apiClient from '../../services/apiClient';
import { useHistory, useLocation } from 'react-router-dom';

type LogInProps = {
  setLoggedIn: (x: boolean) => void;
};

const LogIn = ({ setLoggedIn }: LogInProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  const [unknownError, setUnknownError] = useState(false);
  let history = useHistory();
  let location = useLocation();
  let { from }: any = location.state || { from: { pathname: '/' } };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setAuthError(false);
    setUnknownError(false);

    apiClient.get('/sanctum/csrf-cookie').then((response) => {
      apiClient
        .post('/login', {
          email: email,
          password: password,
        })
        .then((response) => {
          sessionStorage.setItem('email', email);
          setLoggedIn(true);
          sessionStorage.setItem('loggedIn', 'true');
          history.replace(from);
        })
        .catch((error) => {
          if (error.response && error.response.status === 422) {
            setAuthError(true);
          } else {
            setUnknownError(true);
            console.error(error);
          }
        });
    });
  };
  return (
    <div className='flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full'>
        <h2 className='mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900'>
          Sign in to your account
        </h2>
        <form className='mt-8' onSubmit={handleSubmit}>
          <div className='rounded-md shadow-sm'>
            <div>
              <input
                type='email'
                name='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5'
              />
            </div>
            <div className='-mt-px'>
              <input
                type='password'
                name='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5'
              />
            </div>
          </div>
          {authError ? (
            <div className='mt-2 text-red-600'>
              Credentials not recognised. Please try again.
            </div>
          ) : null}
          {unknownError ? (
            <div className='mt-2 text-red-600'>
              There was an error submitting your details.
            </div>
          ) : null}
          <div className='mt-6'>
            <button
              type='submit'
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out'
            >
              <span className='absolute left-0 inset-y-0 flex items-center pl-3'>
                <svg
                  className='h-5 w-5 text-indigo-500 group-hover:text-indigo-400 transition ease-in-out duration-150'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                    clipRule='evenodd'
                  />
                </svg>
              </span>
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
