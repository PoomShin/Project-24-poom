import view from '../../assets/view.png';
import hide from '../../assets/hide.png';

export default function ViewCourseButton({ onClick, isSeeCourseName }) {
    const activeColor = isSeeCourseName ? 'bg-orange-500' : '';

    return (
        <div>
            <button className={`p-1 flex items-center rounded-md text-sm font-bold text-white bg-zinc-600 ${activeColor}`}
                onClick={onClick}
            >
                <img src={isSeeCourseName ? view : hide} alt='Course Image' className='mx-1 w-6 h-6' />
                <span className="truncate">view course</span>
            </button>
        </div>
    );
}