export default function TimeBlock({ colStart, colEnd, bgStyle, codeCurriculum, groupNum, name, lab }) {
    return (
        <div className={`${colStart} ${colEnd} 
        inline-flex flex-col justify-between border rounded p-2 hover:bg-opacity-70 cursor-pointer bg-opacity-100 border-gray-700 ${bgStyle}`}>
            <p className='flex justify-between text-xs'>
                <span>{codeCurriculum}</span>
                <span>SEC: {groupNum}</span>
            </p>
            <div className='flex justify-between text-xs text-gray-700'>
                <div>
                    {name}
                </div>
                <div className='text-right'>
                    {lab}
                </div>
            </div>
        </div>
    );
};