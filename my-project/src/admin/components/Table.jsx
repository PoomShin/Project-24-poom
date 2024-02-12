export default function Table(p) {
    return (
        <div className={`h-64 flex flex-col overflow-y-auto text-left ${p.bg}`} >
            <h1 className='text-center text-xl'>{p.text}</h1>
            <table className='first-letter:w-full table-auto'>
                <thead>
                    <tr className="bg-indigo-300">
                        <th className="py-2 w-28">course code</th>
                        <th className="py-2 w-10">curriculum</th>
                        <th className="px-4 py-2">thname</th>
                        <th className="px-4 py-2">engname</th>
                        <th className="py-2 w-20">credits</th>
                        <th className="py-2 w-28">course type</th>
                        <th className="py-2 w-16">transfer</th>
                    </tr>
                </thead>
                {p.children}
            </table>
            <div className="w-1 h-full rounded bg-gray-500"></div>
        </div>
    );
}