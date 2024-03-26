import { createPortal } from 'react-dom';
import { useState } from 'react';
import useAdminApi from '../../api/Admin_API';
import AlertModal from '../../public/AlertModal';

export default function AddProfModal({ branchTag, isVisible, onClose }) {
  const addProfMutation = useAdminApi().useAddProfMutation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'prof',
    branch_tag: branchTag || '',
  });
  const [isAlert, setIsAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await addProfMutation.mutateAsync(formData);
      setAlertMessage(result.message);
      setIsAlert(true);
    } catch (error) {
      console.error(error.message);
      setAlertMessage(error.message);
      setIsAlert(true);
    } finally {
      onClose();
    }
  };

  const handleChange = (e) => {
    //input
    let name = document.getElementById('name').value.trim();
    let email = document.getElementById('email').value;
    let submit_btn = document.getElementById('submit_btn');
    let name_check = false;
    let email_check = false;
    //check
    let arr_name = name.split(' ');
    // input have firstname only = disable btn
    if (arr_name.length == 1) {
      submit_btn.disabled = true;
      submit_btn.classList.remove('bg-green-500');
      submit_btn.classList.remove('hover:bg-green-600');
    } else {
      submit_btn.disabled = false;
      submit_btn.classList.add('bg-green-500');
      submit_btn.classList.add('hover:bg-green-600');
    }
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <>
      {isVisible &&
        createPortal(
          <div className='fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-gray-800 bg-opacity-60 z-50'>
            <form className='bg-gray-300 p-4 rounded-xl shadow-2xl'
              method='post'
              onSubmit={handleSubmit}
            >
              <h1 className='text-xl text-center text-black'>Add Prof</h1>
              <div className='my-3'>
                <input className='mt-1 p-1 w-full border-2 border-solid rounded border-black'
                  type='text'
                  id='name'
                  placeholder='firstname lastname'
                  onChange={handleChange}
                  value={formData.name}
                  required
                />
              </div>
              <div className='mb-3'>
                <input className='mt-1 p-1 w-full border-2 border-solid rounded border-black'
                  type='email'
                  id='email'
                  placeholder='your email'
                  onChange={handleChange}
                  value={formData.email}
                  required
                />
              </div>
              <div className='mb-3'>
                <input className='mt-1 p-1 w-full border-2 border-solid border-black rounded'
                  type='text'
                  id='branch_tag'
                  readOnly
                  onChange={handleChange}
                  value={formData.branch_tag}
                />
              </div>

              <button className='my-2 py-1 px-8 rounded text-white  hover:text-gray-600'
                type='submit'
                id='submit_btn'
              >
                <span className='text-lg font-bold'>
                  {addProfMutation.isLoading ? 'Submitting...' : 'Submit'}
                </span>
              </button>

              <button className='my-2 py-1 px-8 rounded bg-red-500 text-white hover:bg-red-600 hover:text-gray-600'
                type='button'
                onClick={onClose}
              >
                <span className='text-lg font-bold'>Close</span>
              </button>
            </form>
          </div>,
          document.getElementById('root-modal')
        )}
      {isAlert && (
        <AlertModal
          isOpen={isAlert}
          onClose={() => setIsAlert(false)}
          message={alertMessage}
        />
      )}
    </>
  );
}
