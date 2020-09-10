import React, { useState, useEffect, useReducer } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import apiClient from '../../services/apiClient';
import deleteIcon from '../../images/icons8-delete.svg';
import DeleteBoard from '../DeleteBoard';
import EditBoard from '../EditBoard';
import TaskList from '../TaskList';
import CreateTaskList from '../CreateTaskList';
import _ from 'lodash';

type BoardProps = {
  boardId: number;
  setNavColor: React.Dispatch<React.SetStateAction<string>>;
};

type Board = {
  id: number;
  title: string;
  user_id: number;
  color: string;
  task_lists_order: string[];
  task_lists: Record<string, TaskList>;
};

type TaskList = {
  id: number;
  title: string;
  tasks: Record<string, Task>;
};

type Task = { id: number; description: string };

function boardReducer(state: any, action: any) {
  switch (action.type) {
    case 'INITIALIZE':
      const convertedData = Object.fromEntries(
        action.payload.task_lists.map((taskList: any) => [
          taskList.id,
          {
            ...taskList,
            tasks_order:
              taskList.tasks_order && taskList.tasks_order.length > 0
                ? taskList.tasks_order.trim().split(' ')
                : [],
            tasks: Object.fromEntries(
              taskList.tasks.map((task: Task) => [task.id, { ...task }]),
            ),
          },
        ]),
      );

      const taskListsOrder =
        action.payload.task_lists_order.length > 0
          ? action.payload.task_lists_order.trim().split(' ')
          : [];
      return {
        ...action.payload,
        task_lists_order: taskListsOrder,
        task_lists: convertedData,
      };
    case 'EDIT_BOARD':
      return {
        ...state,
        color: action.payload.color,
        title: action.payload.title,
      };
    case 'CREATE_TASK_LIST':
      return {
        ...state,
        task_lists_order: state.task_lists_order.concat(
          action.payload.id.toString(),
        ),
        task_lists: {
          ...state.task_lists,
          [action.payload.id]: {
            ...action.payload,
            tasks_order: [],
            tasks: {},
          },
        },
      };
    case 'DELETE_TASK_LIST':
      const taskListOrder = _.without(
        state.task_lists_order,
        action.payload.toString(),
      );
      delete state.task_lists[action.payload];
      return { ...state, task_lists_order: taskListOrder };
    case 'UPDATE_TASK_LIST':
      return {
        ...state,
        task_lists: {
          ...state.task_lists,
          [action.payload.id]: {
            ...action.payload,
            tasks: state.task_lists[action.payload.id].tasks,
          },
        },
      };
    case 'CREATE_TASK':
      return {
        ...state,
        task_lists: {
          ...state.task_lists,
          [action.payload.task_list_id]: {
            ...state.task_lists[action.payload.task_list_id],
            tasks_order: state.task_lists[
              action.payload.task_list_id
            ].tasks_order.concat(action.payload.id.toString()),
            tasks: {
              ...state.task_lists[action.payload.task_list_id].tasks,
              [action.payload.id]: action.payload,
            },
          },
        },
      };
    case 'DELETE_TASK':
      const tasksOrder = _.without(
        state.task_lists[action.payload.task_list_id].tasks_order,
        action.payload.id.toString(),
      );
      delete state.task_lists[action.payload.task_list_id].tasks.id;
      return {
        ...state,
        task_lists: {
          ...state.task_lists,
          [action.payload.task_list_id]: {
            ...state.task_lists[action.payload.task_list_id],
            tasks_order: tasksOrder,
          },
        },
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        task_lists: {
          ...state.task_lists,
          [action.payload.task_list_id]: {
            ...state.task_lists[action.payload.task_list_id],
            tasks: {
              ...state.task_lists[action.payload.task_list_id].tasks,
              [action.payload.id]: action.payload,
            },
          },
        },
      };

    case 'DRAG_TASK':
      return {
        ...action.payload,
      };
    default:
      throw new Error();
  }
}

const Board = ({ boardId, setNavColor }: BoardProps) => {
  const [board, dispatch] = useReducer(boardReducer, null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  useEffect(() => {
    apiClient
      .get(`/api/boards/${boardId}`)
      .then((response) => {
        setNavColor(response.data.color.replace('600', '700'));
        dispatch({ type: 'INITIALIZE', payload: response.data });
      })
      .catch((error) => console.error(error));
    return () => {
      setNavColor('bg-blue-700');
    };
  }, [boardId, setNavColor]);

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = board.task_lists[source.droppableId];
    const finish = board.task_lists[destination.droppableId];

    // Moving in the same list
    if (start === finish) {
      const newTaskOrder = Array.from(start.tasks_order);
      newTaskOrder.splice(source.index, 1);
      newTaskOrder.splice(destination.index, 0, draggableId);

      const newTaskList = {
        ...start,
        tasks_order: newTaskOrder,
      };
      dispatch({
        type: 'DRAG_TASK',
        payload: {
          ...board,
          task_lists: {
            ...board.task_lists,
            [newTaskList.id]: { ...newTaskList },
          },
        },
      });

      apiClient
        .patch(`api/tasks/${draggableId}/reorder`, {
          destinationListId: destination.droppableId,
          destinationListTaskOrder: newTaskOrder.join(' '),
        })
        .catch((error) => {
          console.error(error);
        });

      return;
    }

    // Moving from one list to another
    const startTasksOrder = Array.from(start.tasks_order);
    startTasksOrder.splice(source.index, 1);
    const newStartTaskList = {
      ...start,
      tasks_order: startTasksOrder,
    };
    delete newStartTaskList.tasks.draggableId;

    const finishTaskOrder = Array.from(finish.tasks_order);
    finishTaskOrder.splice(destination.index, 0, draggableId);

    const newFinishTaskList = {
      ...finish,
      tasks: {
        ...finish.tasks,
        [start.tasks[draggableId].id]: { ...start.tasks[draggableId] },
      },
      tasks_order: finishTaskOrder,
    };

    dispatch({
      type: 'DRAG_TASK',
      payload: {
        ...board,
        task_lists: {
          ...board.task_lists,
          [newStartTaskList.id]: { ...newStartTaskList },
          [newFinishTaskList.id]: { ...newFinishTaskList },
        },
      },
    });

    apiClient
      .patch(`api/tasks/${draggableId}/reorder`, {
        sourceListTaskOrder: startTasksOrder.join(' '),
        destinationListId: destination.droppableId,
        destinationListTaskOrder: finishTaskOrder.join(' '),
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <React.Fragment>
      <DragDropContext onDragEnd={onDragEnd}>
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
              {board.task_lists_order.map((taskListId: string) => (
                <Droppable key={taskListId} droppableId={`${taskListId}`}>
                  {(provided, snapshot) => (
                    <TaskList
                      key={taskListId}
                      taskList={board.task_lists[taskListId]}
                      dispatch={dispatch}
                      innerRef={provided.innerRef}
                      isDraggingOver={snapshot.isDraggingOver}
                      {...provided.droppableProps}
                    >
                      {provided.placeholder}
                    </TaskList>
                  )}
                </Droppable>
              ))}

              <CreateTaskList
                boardId={board.id}
                dispatch={dispatch}
              ></CreateTaskList>
            </div>
            {editModal ? (
              <EditBoard
                setNavColor={setNavColor}
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
      </DragDropContext>
    </React.Fragment>
  );
};

export default Board;
