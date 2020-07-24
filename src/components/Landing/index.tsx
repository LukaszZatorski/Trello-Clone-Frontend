import React from 'react';
import { Link } from 'react-router-dom';

type LandingProps = {
  loggedIn: boolean;
};

const Landing = ({ loggedIn }: LandingProps) => {
  return (
    <div className='overflow-hidden'>
      <div className='mt-10 mx-auto max-w-screen-xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28'>
        <div className='sm:text-center'>
          <h2 className='text-4xl tracking-tight leading-10 font-extrabold text-gray-900 sm:text-5xl sm:leading-none md:text-6xl'>
            Welcome to Trello Clone
          </h2>
          <p className='mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg '>
            Trello’s boards, lists, and cards enable you to organize and
            prioritize your projects in a fun, flexible, and rewarding way.
          </p>
          <div className='mt-5 sm:mt-8 sm:flex sm:justify-center'>
            {loggedIn ? (
              <div className='rounded-md shadow'>
                <Link
                  to='/boards'
                  className='w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10'
                >
                  Go to Your Boards
                </Link>
              </div>
            ) : (
              <React.Fragment>
                <div className='rounded-md shadow'>
                  <Link
                    to='/signup'
                    className='w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10'
                  >
                    Get started
                  </Link>
                </div>
                <div className='mt-3 sm:mt-0 sm:ml-3'>
                  <Link
                    to='login'
                    className='w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-300 transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10'
                  >
                    Log in
                  </Link>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
