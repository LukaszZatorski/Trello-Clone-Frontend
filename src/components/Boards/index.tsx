import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import BoardForm from '../BoardForm';
import { Link } from 'react-router-dom';

type Board = {
  id: number;
  title: string;
  user_id: number;
};

type Boards = [Board];

const Boards = () => {
  const [boards, setBoards] = useState<Boards>();
  const [modalOn, setModalOn] = useState(false);

  useEffect(() => {
    apiClient
      .get(`/api/users/${sessionStorage.getItem('email')}/boards`)
      .then((response) => {
        setBoards(response.data);
      })
      .catch((error) => console.error(error));
  }, [modalOn]);

  return (
    <div className='mt-10 mx-auto max-w-screen-xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28'>
      <h2 className='text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-10'>
        Your Boards
      </h2>
      <ul className='mt-10 flex flex-wrap'>
        {boards
          ? boards.map((board) => (
              <li
                className='m-2 flex-grow md:flex-grow-0 lg:w-1/6 md:w-1/4 w-2/5 h-24 rounded text-white bg-blue-700 p-3 hover:opacity-75 transition ease-in-out duration-150'
                key={board.id}
              >
                {board.title}
              </li>
            ))
          : null}
        <button
          onClick={() => setModalOn(true)}
          className='m-2 flex-grow md:flex-grow-0 lg:w-1/6 md:w-1/4 w-2/5 h-24 rounded bg-gray-200 flex items-center justify-center p-3 hover:bg-gray-400 transition ease-in-out duration-150'
        >
          Create New Board
        </button>
      </ul>
      {modalOn ? <BoardForm setModalOn={setModalOn}></BoardForm> : null}
    </div>
  );
};

export default Boards;
