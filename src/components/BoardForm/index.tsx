import React, { useState, SyntheticEvent } from 'react';
import apiClient from '../../services/apiClient';

type BoardFormProps = {
  setModalOn: React.Dispatch<React.SetStateAction<boolean>>;
};

const BoardForm = ({ setModalOn }: BoardFormProps) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    apiClient
      .post('/api/boards', {
        email: sessionStorage.getItem('email'),
        title: title,
      })
      .then((response) => {
        setModalOn(false);
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div className='fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center'>
      <div className='fixed inset-0 transition-opacity'>
        <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
      </div>

      <div
        className='bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full'
        role='dialog'
        aria-modal='true'
        aria-labelledby='modal-headline'
      >
        <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
          <div className='sm:flex sm:items-start'>
            <div className='mt-3 text-center sm:mt-0 sm:ml-4 '>
              <form className='mt-2' onSubmit={handleSubmit}>
                <div>
                  <input
                    type='text'
                    name='title'
                    placeholder='Title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className='w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5'
                  />
                </div>
                <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
                  <span className='flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto'>
                    <button
                      type='submit'
                      className='inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5'
                    >
                      Create Board
                    </button>
                  </span>
                  <span className='mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto'>
                    <button
                      onClick={() => setModalOn(false)}
                      type='button'
                      className='inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5'
                    >
                      Cancel
                    </button>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BoardForm;
