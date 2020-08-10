import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import deleteIcon from '../../images/icons8-delete.svg';
import DeleteBoard from '../DeleteBoard';
import EditBoard from '../EditBoard';
import TaskList from '../TaskList';

type BoardProps = {
  boardId: number;
};

type Board = {
  id: number;
  title: string;
  user_id: number;
  color: string;
};

type TaskList = {
  id: number;
  title: string;
};

type TaskLists = [TaskList];

const Board = ({ boardId }: BoardProps) => {
  const [board, setBoard] = useState<Board>();
  const [taskLists, setTaskLists] = useState<TaskLists>();
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  useEffect(() => {
    apiClient
      .get(`/api/boards/${boardId}`)
      .then((response) => {
        setBoard(response.data.board);
        setTaskLists(response.data.boardTaskList);
      })
      .catch((error) => console.error(error));
  }, [boardId, editModal]);

  return (
    <React.Fragment>
      {board ? (
        <div className={`flex-1 p-2 overflow-auto ${board.color}`}>
          <div className='flex justify-between m-4'>
            <h3 className='text-2xl text-white font-bold'>{board.title}</h3>
            <div className='flex'>
              <button
                onClick={() => setEditModal(true)}
                className='flex group items-center rounded py-1 px-4 mr-2 text-white bg-gray-200 bg-opacity-25 hover:bg-gray-500 hover:bg-opacity-25 transition ease-in-out duration-150'
              >
                Edit
              </button>
              <button
                onClick={() => setDeleteModal(true)}
                className='flex group items-center rounded py-1 px-3 text-white bg-gray-200 bg-opacity-25 hover:bg-gray-500 hover:bg-opacity-25 transition ease-in-out duration-150'
              >
                <img src={deleteIcon} alt='Delete board' className='' />
                <p className='group-hover:inline-block ml-1 hidden'>Delete</p>
              </button>
            </div>
          </div>
          <div className='flex flex-shrink-0'>
            {taskLists
              ? taskLists.map((taskList) => (
                  <TaskList key={taskList.id} taskList={taskList}></TaskList>
                ))
              : null}
          </div>
          {editModal ? (
            <EditBoard setEditModal={setEditModal} board={board}></EditBoard>
          ) : null}
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
