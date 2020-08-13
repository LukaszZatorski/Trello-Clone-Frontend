import React, { useState, SyntheticEvent } from 'react';
import apiClient from '../../services/apiClient';
import deleteListIcon from '../../images/icons8-deletelist.svg';

type TaskListProps = {
  taskList: { id: number; title: string };
  dispatch: React.Dispatch<any>;
};

const TaskList = ({ taskList, dispatch }: TaskListProps) => {
  const [editTaskList, setEditTaskList] = useState(false);
  const [title, setTitle] = useState(taskList.title);

  const handleDelete = () => {
    apiClient
      .delete(`/api/task-lists/${taskList.id}`)
      .then(() => {
        dispatch({ type: 'DELETE_TASK_LIST', payload: taskList.id });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    apiClient
      .patch(`/api/task-lists/${taskList.id}`, {
        title: title,
      })
      .then((response) => {
        dispatch({ type: 'UPDATE_TASK_LIST', payload: response.data });
        setEditTaskList(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <div className='m-2 p-3 bg-gray-200 w-64 rounded-sm flex-shrink-0'>
        {editTaskList ? (
          <form
            onSubmit={handleSubmit}
            onBlur={() => {
              setEditTaskList(false);
            }}
            onKeyDown={(e) =>
              e.key === 'Escape' ? setEditTaskList(false) : null
            }
          >
            <input
              type='text'
              name='title'
              placeholder={title}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
              className='w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5'
            />
          </form>
        ) : (
          <div className='flex justify-between'>
            <h3
              onClick={() => setEditTaskList(true)}
              className='ml-2 font-semibold'
            >
              {taskList.title}
            </h3>
            <img
              src={deleteListIcon}
              onClick={handleDelete}
              alt='Delete list'
              className='cursor-pointer'
            />
          </div>
        )}
        <div className='mt-2 p-2 bg-white rounded'>Task</div>
        <div className='mt-2 p-2 bg-white rounded'>Task 2</div>
      </div>
    </div>
  );
};

export default TaskList;
