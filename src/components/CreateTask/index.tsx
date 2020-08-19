import React, { useState, SyntheticEvent } from 'react';
import apiClient from '../../services/apiClient';
import plusIcon from '../../images/icons8-plusGray.svg';

type CreateTaskProps = {
  taskListId: number;
  dispatch: React.Dispatch<any>;
};

const CreateTask = ({ taskListId, dispatch }: CreateTaskProps) => {
  const [createTask, setCreateTask] = useState(false);
  const [description, setDescription] = useState('');
  const inputElement = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    apiClient
      .post('/api/tasks', {
        taskListId: taskListId,
        description: description,
      })
      .then((response) => {
        setDescription('');
        dispatch({ type: 'CREATE_TASK', payload: response.data });
        inputElement.current!.focus();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <React.Fragment>
      {createTask ? (
        <form
          onSubmit={handleSubmit}
          onKeyDown={(e) => (e.key === 'Escape' ? setCreateTask(false) : null)}
        >
          <div>
            <input
              type='text'
              name='description'
              placeholder='Enter a description...'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              ref={inputElement}
              autoFocus
              required
              className='w-full mt-2 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5'
            />
          </div>
          <div className='flex my-2'>
            <span className='flex mr-3 w-full rounded-md shadow-sm sm:w-auto'>
              <button
                type='submit'
                className='justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5'
              >
                Add Task
              </button>
            </span>
            <span className='flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto'>
              <button
                onClick={() => setCreateTask(false)}
                type='button'
                className='inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5'
              >
                Cancel
              </button>
            </span>
          </div>
        </form>
      ) : (
        <div
          onClick={() => setCreateTask(true)}
          className='flex mt-2 p-1 rounded hover:bg-gray-500 hover:bg-opacity-25 transition ease-in-out duration-150 cursor-pointer'
        >
          <img
            src={plusIcon}
            alt='Add task list'
            className='mr-1 h-4 self-center'
          />
          <p className='text-gray-600'>Add task</p>
        </div>
      )}
    </React.Fragment>
  );
};

export default CreateTask;
