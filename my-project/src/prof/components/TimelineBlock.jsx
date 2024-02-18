export default function TimelineBlock({ startHour, endHour }) {
    return (
        <div className={`${startHour} ${endHour} flex flex-col justify-between border rounded p-2 md:px-3 md:py-2 bg-opacity-60 hover:bg-opacity-70 cursor-pointer dark:bg-opacity-100 dark:border-gray-700 bg-green-200`}>
            <p className='flex flex-wrap justify-between mb-2 text-xs md:text-sm'>
                <span>03603341-60</span>
                <span>SEC:830</span>
            </p>
            <div className='flex justify-between text-xs text-gray-700'>
                <div >
                    กาญจนา เอี่ยมสะอาด
                </div>
                <div className='text-right'>
                    LabDat23
                </div>
            </div>
        </div>
    );
}