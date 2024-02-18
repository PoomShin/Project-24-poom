export default function DayDiv({ DayText, colorStyle }) {
    return (
        <div className={`first-line:p-1 md:p-3 col-span-2 border-r-2 dark:border-gray-700 ${colorStyle}`}>
            <span className='font-bold dark:text-gray-900'>{DayText}</span>
        </div>
    )
}