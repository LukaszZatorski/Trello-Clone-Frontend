import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import deleteIcon from '../../images/icons8-delete.svg';
import DeleteBoard from '../DeleteBoard';

type BoardProps = {
  boardId: number;
};

type Board = {
  id: number;
  title: string;
  user_id: number;
  color: string;
};

const Board = ({ boardId }: BoardProps) => {
  const [board, setBoard] = useState<Board>();
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    apiClient
      .get(`/api/boards/${boardId}`)
      .then((response) => {
        setBoard(response.data);
      })
      .catch((error) => console.error(error));
  }, [boardId]);

  return (
    <React.Fragment>
      {board ? (
        <div className={`flex-1 p-2 ${board.color}`}>
          <div className='flex justify-between m-4'>
            <h3 className='text-2xl text-white font-bold'>{board.title}</h3>
            <div className='flex'>
              <button
                onClick={() => setDeleteModal(true)}
                className='flex group items-center rounded py-1 px-3 text-white bg-gray-200 bg-opacity-25 hover:bg-gray-500 hover:bg-opacity-25 transition ease-in-out duration-150'
              >
                <img src={deleteIcon} alt='Delete board' className='' />
                <p className='group-hover:inline-block ml-1 hidden'>Delete</p>
              </button>
            </div>
          </div>
          <div className='flex'>
            <div>Hello World</div>
            <div>Hello World</div>
            <div>Hello World</div>
          </div>
          {deleteModal ? (
            <DeleteBoard
              setDeleteModal={setDeleteModal}
              boardId={board.id}
            ></DeleteBoard>
          ) : null}
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default Board;
