import React, { useState, SyntheticEvent } from 'react';
import apiClient from '../../services/apiClient';
import deleteIcon from '../../images/icons8-deleteblack.svg';

type TaskProps = {
  task: { id: number; description: string };
  dispatch: React.Dispatch<any>;
};

const Task = ({ task, dispatch }: TaskProps) => {
  const [editTask, setEditTask] = useState(false);
  const [description, setDescription] = useState(task.description);

  const handleDelete = () => {
    apiClient
      .delete(`/api/tasks/${task.id}`)
      .then(() => {
        dispatch({ type: 'DELETE_TASK', payload: task });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    apiClient
      .patch(`/api/tasks/${task.id}`, {
        description: description,
      })
      .then((response) => {
        dispatch({ type: 'UPDATE_TASK', payload: response.data });
        setEditTask(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div
      onDoubleClick={() => setEditTask(true)}
      className='flex group justify-between mt-2 p-2 bg-white rounded'
    >
      {editTask ? (
        <form
          onSubmit={handleSubmit}
          onBlur={() => {
            setEditTask(false);
          }}
          onKeyDown={(e) => (e.key === 'Escape' ? setEditTask(false) : null)}
        >
          <input
            type='text'
            name='description'
            placeholder={description}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autoFocus
            required
            className='w-full p-1 border rounded focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10'
          />
        </form>
      ) : (
        <p className='break-all'>{task.description}</p>
      )}
      <img
        src={deleteIcon}
        onClick={handleDelete}
        alt='Delete task'
        className='cursor-pointer group-hover:inline-block hidden'
      />
    </div>
  );
};

export default Task;
