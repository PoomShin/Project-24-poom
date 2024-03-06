export default function TimeBlock({ colStart, colEnd, bgStyle, codeCurriculum, groupNum, names, lab, profName }) {
    let displayNames = names;

    if (Array.isArray(names)) {
        if (names.length > 1 || names[0] !== profName) {
            displayNames = names.join(', ').slice(0, 25) + (names.join(', ').length > 25 ? '...' : '');
        }
    } else if (names === profName) {
        displayNames = profName.slice(0, 25) + (profName.length > 25 ? '...' : '');
    }

    return (
        <div className={`${colStart} ${colEnd} 
        inline-flex flex-col justify-between border rounded p-2 hover:bg-opacity-70 cursor-pointer bg-opacity-100 border-gray-700 ${bgStyle}`}>
            <p className='flex justify-between text-xs'>
                <span>{codeCurriculum}</span>
                <span>SEC: {groupNum}</span>
            </p>
            <div className='flex justify-between text-xs text-gray-700'>
                <div>
                    {displayNames}
                </div>
                <div className='text-right'>
                    {lab}
                </div>
            </div>
        </div>
    );
};
