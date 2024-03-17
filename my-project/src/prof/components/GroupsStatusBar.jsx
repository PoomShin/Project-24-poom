export default function GroupsStatusBar({ waiting, accept, reject, overlap }) {
    return (
        <div className='pt-2 leading-none flex gap-2 items-center text-lg font-bold'>
            <p className='text-yellow-900 underline decoration-yellow-600 rounded-sm'>Waiting: {waiting}</p>
            <p className='text-green-900 underline decoration-green-600 rounded-sm'>Accept: {accept}</p>
            <p className='text-red-900 underline decoration-red-600 rounded-sm'>Reject: {reject}</p>
            <p className='text-neutral-900  underline decoration-neutral-600 rounded-sm'>Overlapping: {overlap}</p>
        </div>
    );
}