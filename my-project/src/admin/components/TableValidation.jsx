export default function TableValidation({ filterDataByCourseTag }) {
    return (
        <div className='flex justify-center my-10'>
            <button className='inline-block' onClick={filterDataByCourseTag}>
                <img src={transferIcon} alt="transfer icon" className='h-16' />
            </button>
        </div>
    );
}

import transferIcon from '../../assets/transfer.png';