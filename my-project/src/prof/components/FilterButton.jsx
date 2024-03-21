export default function FilterButton({ filterName, filterCriteria, onFilter }) {
    return (
        <button className={`px-1 border border-gray-600 shadow-sm shadow-black text-white bg-gray-700 ${filterCriteria === 'min' ? 'bg-gradient-to-b from-blue-600 to-gray-600' : 'bg-gradient-to-t from-blue-600 to-gray-600'}`}
            onClick={onFilter}
        >
            {filterName}
        </button>
    )
}