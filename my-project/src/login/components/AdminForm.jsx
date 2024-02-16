export default function AdminForm({ formData, handleLogin, handleChange }) {
    return (
        <Container>
            <form onSubmit={handleLogin}>
                <Input
                    className='w-full border-2 border-solid border-black rounded mt-1 p-1'
                    type='text'
                    name='username'
                    placeholder='Enter Username'
                    value={formData.username}
                    onChange={handleChange}
                />

                <Input
                    className='w-full border-2 border-solid border-black rounded mt-1 p-1'
                    type='password'
                    name='password'
                    placeholder='Enter Password'
                    value={formData.password}
                    onChange={handleChange}
                />

                <button type='submit' className='rounded my-2 px-8 py-1 text-white bg-green-500 hover:bg-green-600'>
                    <span className='text-lg font-bold'>Login</span>
                </button>
            </form>
        </Container>
    );
}

const Container = ({ children }) => {
    return (
        <div className='flex flex-col items-center border border-solid border-black px-12 py-3 bg-emerald-900'>
            <h1 className='font-bold text-white'>For Admin</h1>
            {children}
        </div>
    );
}

const Input = (props) => {
    return (
        <div className='mb-3'>
            <input {...props} />
        </div>
    );
}
