export default function InputSection({ value, onChange, preValue, options, optionKey, style }) {
    return (
        <select className={style}
            value={value}
            onChange={onChange}
        >
            <option value=''>{preValue}</option>
            {options.map((option, index) => (
                <option key={index} value={option[optionKey]}>
                    {option[optionKey]}
                </option>
            ))}
        </select>
    )
}