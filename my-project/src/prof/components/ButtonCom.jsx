export default function ButtonCom({ text, type, onClick, style, isDisable = false }) {
    return (
        <button className={`rounded-sm shadow-md shadow-gray-700 ${style}`}
            type={type}
            onClick={onClick}
            disabled={isDisable}
        >
            {text}
        </button>
    )
}