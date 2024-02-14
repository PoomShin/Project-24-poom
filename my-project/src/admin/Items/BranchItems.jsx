export default function BranchItems({ branches, onSelectBranch }) {
    return (
        <div className="grid lg:grid-cols-7 sm:grid-cols-2 gap-y-16 mr-4 pb-6">
            {branches.map((branch) => (
                <BranchItem key={branch.id} branch={branch} onSelectBranch={onSelectBranch} />
            ))}
        </div>
    );
}

const BranchItem = ({ branch, onSelectBranch }) => (
    <div
        className="relative grid col-span-1 row-span-3 bg-slate-900/25 ml-4 hover:cursor-pointer"
        onClick={() => onSelectBranch(branch.branchtag, branch.coursetag)}
    >
        <img src={moreIcon} alt="moreIcon" className="justify-self-end self-start h-6 mr-2" />
        <p className="justify-self-center self-center text-4xl font-sans">{branch.branchtag}</p>
        <img src={removeIcon} alt="removeIcon" className="justify-self-end self-end h-6 mb-1 mr-2" />

        <div className="absolute bottom-[-30px] left-0 top-[105px] text-wrap">
            <p className="justify-self-start self-end inline-block pl-1">{branch.coursetag}</p>
            <p>{branch.branchname}</p>
        </div>
    </div>
);

import moreIcon from '../../assets/more.png';
import removeIcon from '../../assets/remove.png';