import React from 'react';
import apiClient from '../../services/apiClient';
import deleteListIcon from '../../images/icons8-deletelist.svg';

type TaskListProps = {
  taskList: { id: number; title: string };
  deleteTaskList: (taskListId: number) => void;
};

const TaskList = ({ taskList, deleteTaskList }: TaskListProps) => {
  const handleDelete = () => {
    apiClient
      .delete(`/api/task-lists/${taskList.id}`)
      .then(() => {
        deleteTaskList(taskList.id);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <div className='m-2 p-3 bg-gray-200 w-64 rounded-sm flex-shrink-0'>
        <div className='flex justify-between'>
          <h3 className='ml-2 font-semibold'>{taskList.title}</h3>
          <img
            src={deleteListIcon}
            onClick={handleDelete}
            alt='Delete list'
            className='cursor-pointer'
          />
        </div>
        <div className='mt-2 p-2 bg-white rounded'>Task</div>
        <div className='mt-2 p-2 bg-white rounded'>Task 2</div>
      </div>
    </div>
  );
};

export default TaskList;
