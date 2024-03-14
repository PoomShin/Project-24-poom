import { useCoursesContext } from '../../context/Prof-Context';
import waitingIcon from '../../assets/more.png'

export default function SideBarRight() {
    const { profCourses } = useCoursesContext();
    console.log(profCourses)
    return (
        <div className='overflow-y-auto max-h-dvh grid grid-cols-1 grid-flow-row auto-rows-min col-start-18 col-span-3 items-center border-t-2 border-black bg-ghost_white'>
            <div className='bg-burnt_sienna/65 p-1'>
                <p className='sm:text-xl font-semibold text-center text-white'>My Groups</p>
            </div>
            {profCourses && profCourses.map(course => (
                <div key={course.id} className='mt-2 border-0 border-t-2 border-black bg-gray-200'>
                    <div className='flex justify-between'>
                        <p className='ml-2'>{course.combined_code_curriculum}</p>
                        <p className='mx-2'>{course.course_type}</p>
                    </div>
                    {course.groups.map(group => (
                        <ProfGroup key={group.id} group={group} />
                    ))}
                </div>
            ))}
        </div>
    );
}

const ProfGroup = ({ group }) => {
    const startTimeParts = group.start_time.split(':');
    const endTimeParts = group.end_time.split(':');
    const startTime = `${startTimeParts[0].padStart(2, '0')}:${startTimeParts[1]}`;
    const endTime = `${endTimeParts[0].padStart(2, '0')}:${endTimeParts[1]}`;

    return (
        <div className='flex flex-col ring-1 ring-red-300 py-1'>
            <div className='flex justify-between mx-3'>
                <img src={waitingIcon} className='h-6' />
                <p>{group.num}</p>
                <p>{group.day_of_week}</p>
                <p>{startTime}-{endTime}</p>
            </div>
            <div className='flex overflow-x-auto mt-1'>
                {group.branch_years && group.branch_years.map((branchYear, index) => (
                    <BranchYearItems key={index} branchYear={branchYear} />
                ))}
            </div>
        </div>
    )
}

const BranchYearItems = ({ branchYear }) => {
    return (
        <p className='rounded-sm bg-indigo-900 text-yellow-200 text-xs ml-2 p-1'>
            {branchYear}
        </p>
    );
}
