export const generateOptions = () => {
    const options = [];
    for (let i = 0; i < 100; i++) {
        const value = i.toString().padStart(2, '0');
        options.push(
            <option key={i} value={value}>
                {value}
            </option>
        );
    }
    return options;
};