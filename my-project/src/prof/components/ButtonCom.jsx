export default function ButtonCom({ text, type, onClick, style }) {
    return (
        <button className={style}
            type={type}
            onClick={onClick}
        >
            {text}
        </button>
    )
}