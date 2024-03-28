export default function Table(p) {
    return (
        <div className={`h-2/6 flex flex-col overflow-y-auto custom-scrollbar text-left ${p.bg}`} >
            <h1 className='text-center text-xl'>{p.text}</h1>
            <table className='first-letter:w-full table-auto'>
                <thead>
                    <tr className="bg-indigo-300">
                        <th className="py-2 w-28">Course code</th>
                        <th className="py-2 w-10">Curriculum</th>
                        <th className="px-4 py-2">Thname</th>
                        <th className="px-4 py-2">Engname</th>
                        <th className="py-2 w-20">Credits</th>
                        <th className="py-2 w-28">Course type</th>
                        <th className="py-2 w-16">Action</th>
                    </tr>
                </thead>
                {p.children}
            </table>
            <div className="w-1 h-full rounded bg-gray-500"></div>
        </div>
    );
}