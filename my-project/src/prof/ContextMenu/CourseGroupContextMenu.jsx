import { useUserContext } from "../../context/User-Context";
import { useCourseMutations } from "../data_functions/apiFunctions";

export default function CourseGroupContextMenu({ courseId, position, onClose }) {
    const { userContextValues: { name: profName } } = useUserContext();
    const { handleDeleteCourse } = useCourseMutations();

    const { x, y } = position;
    const onDeleteCourse = () => handleDeleteCourse(courseId, profName, onClose)

    return (
        <div className='absolute z-50 bg-gray-800 border border-gray-700 rounded shadow-md font-semibold text-white' style={{ top: y + 10, left: x, }}>
            <div className='p-2 flex flex-col items-center'>
                <button className='block w-full py-2 px-4 text-left hover:bg-gray-700' onClick={onDeleteCourse}>Delete Course</button>
                <button className='block w-full py-2 px-4 text-left hover:bg-red-700' onClick={onClose}>Close Menu</button>
            </div>
        </div>
    );
}