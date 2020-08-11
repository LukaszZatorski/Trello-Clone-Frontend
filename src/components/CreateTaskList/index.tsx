import React, { useState, SyntheticEvent } from 'react';
import apiClient from '../../services/apiClient';
import plusIcon from '../../images/icons8-plus.svg';
import { CSSTransition } from 'react-transition-group';
import './index.css';

type CreateTaskListProps = {
  boardId: number;
  updateTaskLists: (taskList: TaskList) => void;
};

type TaskList = {
  id: number;
  title: string;
};

const CreateTaskList = ({ boardId, updateTaskLists }: CreateTaskListProps) => {
  const [title, setTitle] = useState('');
  const [createList, setCreateList] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const nodeRef = React.useRef(null);
  const inputElement = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    apiClient
      .post('/api/task-lists', {
        boardId: boardId,
        title: title,
      })
      .then((response) => {
        setTitle('');

        inputElement.current!.focus();

        updateTaskLists(response.data);
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      {showButton && (
        <div
          onClick={() => setCreateList(true)}
          className='flex m-2 p-3 w-64 rounded-sm flex-shrink-0 text-white bg-gray-200 bg-opacity-25 hover:bg-gray-500 hover:bg-opacity-25 transition ease-in-out duration-150 cursor-pointer'
        >
          <img
            src={plusIcon}
            alt='Add task list'
            className='mr-1 h-4 self-center'
          />
          <p>Add task list</p>
        </div>
      )}
      <CSSTransition
        nodeRef={nodeRef}
        in={createList}
        timeout={200}
        classNames='create-list'
        unmountOnExit
        onEnter={() => setShowButton(false)}
        onExited={() => setShowButton(true)}
      >
        <div
          ref={nodeRef}
          className='m-2 p-3 bg-gray-200 w-64 rounded-sm flex-shrink-0'
        >
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type='text'
                name='title'
                placeholder='Enter list title...'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                ref={inputElement}
                autoFocus
                required
                className='w-full p-1 rounded-sm border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5'
              />
            </div>
            <div className='px-4 py-3 sm:px-6 flex '>
              <span className='flex mr-3 w-full rounded-md shadow-sm sm:w-auto'>
                <button
                  type='submit'
                  className='justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5'
                >
                  Add list
                </button>
              </span>
              <span className='flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto'>
                <button
                  onClick={() => setCreateList(false)}
                  type='button'
                  className='inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5'
                >
                  Cancel
                </button>
              </span>
            </div>
          </form>
        </div>
      </CSSTransition>
    </div>
  );
};

export default CreateTaskList;
