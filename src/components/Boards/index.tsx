import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import { Link } from 'react-router-dom';

type Board = {
  id: number;
  title: string;
  user_id: number;
};

type Boards = [Board];

const Boards = () => {
  const [boards, setBoards] = useState<Boards>();

  useEffect(() => {
    apiClient
      .get(`/api/users/${sessionStorage.getItem('email')}/boards`)
      .then((response) => {
        setBoards(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className='mt-10 mx-auto max-w-screen-xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28'>
      <h2 className='text-center text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-10'>
        Your Boards
      </h2>
      <ul className='mt-10 flex space-x-4'>
        {boards
          ? boards.map((board) => (
              <li
                className='lg:w-1/6 md:w-1/4 w-1/2 h-24 rounded text-white bg-blue-700 p-4'
                key={board.id}
              >
                {board.title}
              </li>
            ))
          : null}
      </ul>
    </div>
  );
};

export default Boards;
