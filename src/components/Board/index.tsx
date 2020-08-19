import React, { useState, useEffect, useReducer } from 'react';
import apiClient from '../../services/apiClient';
import deleteIcon from '../../images/icons8-delete.svg';
import DeleteBoard from '../DeleteBoard';
import EditBoard from '../EditBoard';
import TaskList from '../TaskList';
import CreateTaskList from '../CreateTaskList';

type BoardProps = {
  boardId: number;
};

type Board = {
  id: number;
  title: string;
  user_id: number;
  color: string;
  task_lists: TaskLists;
};

type TaskList = {
  id: number;
  title: string;
  tasks: Task[];
};

type Task = { id: number; description: string };

type TaskLists = TaskList[];

function boardReducer(state: any, action: any) {
  switch (action.type) {
    case 'INITIALIZE':
      return { ...action.payload };
    case 'EDIT_BOARD':
      return { ...state, ...action.payload };
    case 'CREATE_TASK_LIST':
      return { ...state, task_lists: [...state.task_lists, action.payload] };
    case 'DELETE_TASK_LIST':
      const updatedTaskLists = state.task_lists?.filter(
        (taskList: TaskList) => taskList.id !== action.payload,
      );
      return { ...state, task_lists: updatedTaskLists };
    case 'UPDATE_TASK_LIST':
      const updatedTaskList = state.task_lists?.map((taskList: TaskList) =>
        taskList.id === action.payload.id ? action.payload : taskList,
      );
      return { ...state, task_lists: updatedTaskList };
    default:
      throw new Error();
  }
}

const Board = ({ boardId }: BoardProps) => {
  const [board, dispatch] = useReducer(boardReducer, null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  useEffect(() => {
    apiClient
      .get(`/api/boards/${boardId}`)
      .then((response) => {
        dispatch({ type: 'INITIALIZE', payload: response.data });
      })
      .catch((error) => console.error(error));
  }, [boardId]);

  return (
    <React.Fragment>
      {board ? (
        <div className={`flex-1 p-2 relative ${board.color}`}>
          <div className='flex justify-between m-4'>
            <h3 className='text-2xl text-white font-bold'>{board.title}</h3>
            <div className='flex'>
              <button
                onClick={() => setEditModal(true)}
                className='flex items-center rounded py-1 px-4 mr-2 text-white bg-gray-200 bg-opacity-25 hover:bg-gray-500 hover:bg-opacity-25 transition ease-in-out duration-150'
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
          <div className='flex m-2 mt-16 overflow-auto absolute top-0 right-0 bottom-0 left-0'>
            {board
              ? board.task_lists.map((taskList: TaskList) => (
                  <TaskList
                    key={taskList.id}
                    taskList={taskList}
                    dispatch={dispatch}
                  ></TaskList>
                ))
              : null}
            <CreateTaskList
              boardId={board.id}
              dispatch={dispatch}
            ></CreateTaskList>
          </div>
          {editModal ? (
            <EditBoard
              setEditModal={setEditModal}
              board={board}
              dispatch={dispatch}
            ></EditBoard>
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
