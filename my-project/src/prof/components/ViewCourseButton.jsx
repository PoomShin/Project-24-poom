import view from '../../assets/course.png';
import hide from '../../assets/user.png';

export default function ViewCourseButton({ onClick, isSeeCourseName }) {
    const activeColor = isSeeCourseName ? 'bg-orange-500' : '';

    return (
        <div>
            <button className={`p-1 flex items-center rounded-md text-sm font-bold text-white bg-teal-600 ${activeColor}`}
                onClick={onClick}
            >
                <img src={isSeeCourseName ? view : hide} alt='Course Image' className='mx-1 w-6 h-6' />
                <span className="truncate">{isSeeCourseName ? 'see more' : 'see detail'}</span>
            </button>
        </div>
    );
}