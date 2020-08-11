import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import { Link } from 'react-router-dom';
import CreateBoard from '../CreateBoard';

type Board = {
  id: number;
  title: string;
  user_id: number;
  color: string;
};

type Boards = Board[];

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
    <div>
      <div className='mt-10 mx-auto max-w-screen-xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28'>
        <h2 className='text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-10'>
          Your Boards
        </h2>
        <div className='mt-10 flex flex-wrap'>
          {boards
            ? boards.map((board) => (
                <Link
                  key={board.id}
                  className={`${board.color} m-2 flex-grow md:flex-grow-0 lg:w-1/6 md:w-1/4 w-2/5 h-24 rounded text-white p-3 hover:opacity-75 transition ease-in-out duration-150`}
                  to={`/boards/${board.id}`}
                >
                  {board.title}
                </Link>
              ))
            : null}
          <button
            onClick={() => setModalOn(true)}
            className='m-2 flex-grow md:flex-grow-0 lg:w-1/6 md:w-1/4 w-2/5 h-24 rounded bg-gray-200 flex items-center justify-center p-3 hover:bg-gray-400 transition ease-in-out duration-150'
          >
            Create New Board
          </button>
        </div>
        {modalOn ? <CreateBoard setModalOn={setModalOn}></CreateBoard> : null}
      </div>
    </div>
  );
};

export default Boards;
