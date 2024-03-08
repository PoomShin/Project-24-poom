import GroupItem from "../components/GroupItem";
import AddGroup from "./AddGroup";

export default function GroupList({ sections, onAddSection, creditHours, isLab, setDisableSubmit }) {
    return (
        <div className={`h-64 flex overflow-x-auto ${isLab ? 'bg-orange-100' : 'bg-green-100'} p-4`}>
            {sections.map((sec, index) => (
                <GroupItem key={index} {...sec} isLab={isLab} />
            ))}
            <AddGroup sections={sections} onAddSection={onAddSection} creditHours={creditHours} isLab={isLab} setDisableSubmit={setDisableSubmit} />
        </div>
    );
}