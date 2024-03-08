export default function ButtonCom({ text, type, onClick, style, isDisable }) {
    return (
        <button className={style}
            type={type}
            onClick={onClick}
            disabled={isDisable}
        >
            {text}
        </button>
    )
}