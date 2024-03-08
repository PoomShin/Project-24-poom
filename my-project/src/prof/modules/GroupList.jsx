import GroupItem from "../components/GroupItem";
import AddGroup from "./AddGroup";

export default function GroupList({ mergedSection, sections, onAddSection, creditHours, isLab, setDisableSubmit, children }) {
    return (
        <>
            {children}
            <div className={`h-64 flex overflow-x-auto ${isLab ? 'bg-orange-100' : 'bg-green-100'} p-4`}>
                {sections.map((sec, index) => (
                    <GroupItem key={index} {...sec} isLab={isLab} />
                ))}
                <AddGroup mergedSection={mergedSection} onAddSection={onAddSection} creditHours={creditHours} isLab={isLab} setDisableSubmit={setDisableSubmit} />
            </div>
        </>
    );
}