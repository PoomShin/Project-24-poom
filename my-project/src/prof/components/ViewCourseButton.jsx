import view from '../../assets/view.png';
import hide from '../../assets/hide.png';

export default function ViewCourseButton({ onClick, seeCourseName }) {
    const activeColor = seeCourseName ? 'bg-orange-500' : '';

    return (
        <button className={`p-1 flex items-center rounded-md text-sm font-bold text-white bg-zinc-600 ${activeColor}`}
            onClick={onClick}>
            <img src={seeCourseName ? view : hide} alt='Course Image' className='mx-1 w-6 h-6' />
            <p>view course</p>
        </button>
    );
}