import React, { useState, SyntheticEvent } from 'react';
import apiClient from '../../services/apiClient';
import plusIcon from '../../images/icons8-plusGray.svg';

type CreateTaskProps = {
  taskListId: number;
  dispatch: React.Dispatch<any>;
};

const CreateTask = ({ taskListId, dispatch }: CreateTaskProps) => {
  return (
    <div className='flex mt-2 p-1 rounded hover:bg-gray-500 hover:bg-opacity-25 transition ease-in-out duration-150 cursor-pointer'>
      <img
        src={plusIcon}
        alt='Add task list'
        className='mr-1 h-4 self-center'
      />
      <p className='text-gray-600'>Add task</p>
    </div>
  );
};

export default CreateTask;
