import React, { useState, SyntheticEvent } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import apiClient from '../../services/apiClient';
import deleteIcon from '../../images/icons8-deleteblack.svg';

type TaskProps = {
  task: { id: number; description: string };
  dispatch: React.Dispatch<any>;
  index: number;
};

const Task = ({ task, dispatch, index }: TaskProps) => {
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
    <Draggable draggableId={`${task.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onDoubleClick={() => setEditTask(true)}
          className={`flex group cursor-pointer justify-between mt-2 p-2 rounded shadow ${
            snapshot.isDragging ? 'bg-yellow-200' : 'bg-white'
          }`}
        >
          {editTask ? (
            <form
              onSubmit={handleSubmit}
              onBlur={() => {
                setEditTask(false);
              }}
              onKeyDown={(e) =>
                e.key === 'Escape' ? setEditTask(false) : null
              }
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
            <div className='flex w-full justify-between'>
              <div className='break-all'>{task.description}</div>
              <img
                src={deleteIcon}
                onClick={handleDelete}
                alt='Delete task'
                className='cursor-pointer group-hover:inline-block hidden'
              />
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default Task;
