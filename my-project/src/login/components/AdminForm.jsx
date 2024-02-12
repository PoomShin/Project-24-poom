export default function AdminForm({ handleLogin, setPassword, setUsername }) {
    return (
        <form onSubmit={handleLogin}>
            <div className='my-3'>
                <input className='w-full border-2 border-solid border-black rounded mt-1 p-1'
                    type='text'
                    id='username'
                    placeholder='Enter Username'
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className='mb-3'>
                <input className='w-full border-2 border-solid border-black rounded mt-1 p-1'
                    type='password'
                    id='password'
                    placeholder='Enter Password'
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button type='submit' className='rounded my-2 px-8 py-1 text-white bg-green-500 hover:bg-green-600 '>
                <span className='text-lg font-bold '>Login</span>
            </button>
        </form>
    );
}