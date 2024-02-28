import waitingIcon from '../../assets/more.png'

export default function SideBarRight() {
    return (
        <div className='overflow-y-auto max-h-dvh grid grid-cols-1 col-start-11 col-span-2 items-center border-2 border-t-2 border-r-0 border-black min-h-dvh auto-rows-min grid-flow-row'>
            <div className='border-2 border-l-0 border-r-0 border-t-0 border-black bg-gray-200'>
                <p className='text-teal-900 sm:text-lg text-center'>MyCourse</p>
            </div>

            <ProfCourse />
        </div>
    );
}

const ProfCourse = () => {
    return (
        <div className='border-2 border-l-0 border-r-0 border-t-0 border-black bg-gray-200'>
            <div className='flex'>
                <img src={waitingIcon} className='ml-2 h-6' />
                <p className='ml-3'>03603102-65</p>
                <p className='ml-3'>800</p>
            </div>
        </div>
    )
}
