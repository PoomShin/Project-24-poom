import { useUserContext } from "../../context/User-Context";
import { useDelCourseByName } from "../../api/Profs_API";

export default function CourseGroupContextMenu({ courseId, position, onClose }) {
    const { userContextValues } = useUserContext();
    const { name: profName } = userContextValues;
    const { x, y } = position;

    const { mutate: delCourseByName } = useDelCourseByName();

    const handleDeleteCourse = async () => {
        try {
            await delCourseByName({ courseId, profName });
            onClose();
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    return (
        <div className='absolute z-50 bg-gray-800 border border-gray-700 rounded shadow-md font-semibold text-white' style={{
            top: y + 10,
            left: x,
        }}>
            <div className='p-2 flex flex-col items-center'>
                <button className='block w-full py-2 px-4 text-left hover:bg-gray-700' onClick={handleDeleteCourse}>Delete Course</button>
                <button className='block w-full py-2 px-4 text-left hover:bg-red-700' onClick={onClose}>Close Menu</button>
            </div>
        </div>
    );
}
