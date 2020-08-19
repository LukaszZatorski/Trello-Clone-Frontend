import React, { useState, SyntheticEvent } from 'react';
import apiClient from '../../services/apiClient';

type TaskProps = {
  task: { id: number; description: string };
  dispatch: React.Dispatch<any>;
};

const Task = ({ task, dispatch }: TaskProps) => {
  return <div className='mt-2 p-2 bg-white rounded'>{task.description}</div>;
};

export default Task;
