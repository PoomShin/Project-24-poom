import { useState } from 'react';
import { createPortal } from 'react-dom';
import { initialAddBranchFormState } from '../data_functions/initialData';
import useAdminApi from '../../api/Admin_API';
import AlertModal from '../../public/AlertModal';

export default function AddBranchModal({ isVisible, onClose }) {
  const addBranchMutation = useAdminApi().useAddBranchMutation();

  const [formData, setFormData] = useState(initialAddBranchFormState);

  const [alertMessage, setAlertMessage] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await addBranchMutation.mutateAsync(formData);
      setAlertMessage(result.message);
      setIsAlertOpen(true);
    } catch (error) {
      console.log(error.message)
      setAlertMessage('duplicated branch_tag or course_code');
      setIsAlertOpen(true);
    } finally {
      setFormData(initialAddBranchFormState);
      onClose();
    }
  };

  return (
    <>
      {isAlertOpen && ( // Conditionally render the alert modal
        <AlertModal
          isOpen={isAlertOpen}
          onClose={() => setIsAlertOpen(false)}
          message={alertMessage}
        />
      )}
      {isVisible && createPortal(
        <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-60 z-[10]'>
          <form className='bg-emerald-800 p-4 rounded-xl'
            onSubmit={handleSubmit}
            method='post'
          >
            <h1 className='text-xl text-center text-white'>Add Branch</h1>

            <div className='my-3'>
              <input className='w-full border-2 border-solid border-black rounded mt-1 p-1'
                id='branch_name'
                type='text'
                placeholder='BranchName'
                required
                onChange={handleChange}
                value={formData.branch_name}
              />
            </div>
            <div className='mb-3'>
              <input className='w-full border-2 border-solid border-black rounded mt-1 p-1'
                id='branch_tag'
                type='text'
                placeholder='BranchTag (e.g., 01)'
                required
                maxLength='2'
                onKeyDown={(e) => {
                  if (!/^\d$/.test(e.key) && !/^(Backspace|ArrowLeft|ArrowRight|Delete)$/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={handleChange}
                value={formData.branch_tag}
              />
            </div>
            <div className='mb-3'>
              <input className='w-full border-2 border-solid border-black rounded mt-1 p-1'
                id='course_tag'
                type='text'
                placeholder='CourseTag (e.g., 03600)'
                required
                maxLength='5'
                onKeyDown={(e) => {
                  if (!/^\d$/.test(e.key) && !/^(Backspace|ArrowLeft|ArrowRight|Delete)$/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={handleChange}
                value={formData.course_tag}
              />
            </div>

            <button className='my-2 py-1 px-8 rounded text-white bg-green-500 hover:bg-green-600 hover:text-gray-600 text-lg font-bold'
              type='submit'
            >
              Submit
            </button>

            <button className='my-2 py-1 px-8 text-white bg-red-500 rounded hover:bg-red-600 hover:text-gray-600 text-lg font-bold'
              type='button'
              onClick={onClose}
            >
              Close
            </button>
          </form>
        </div>, document.getElementById('root-modal'))}
    </>
  );
}