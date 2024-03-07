export default function ConfirmationModal({ isOpen, message, onConfirm, onCancel }) {
    return (
        <div className={`fixed inset-0 z-50 overflow-auto ${isOpen ? 'block' : 'hidden'}`}>
            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
            <div className="modal-content bg-white w-1/2 p-4 rounded-lg shadow-lg absolute top-5 left-1/2 transform -translate-x-1/2">
                <p className="text-lg text-center">{message}</p>
                <div className="modal-actions mt-4 flex justify-center">
                    <button className="mr-2 px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600" onClick={onConfirm}>Confirm</button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-300" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};
