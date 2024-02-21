import { useDelBranchMutation } from '../../context/Admin-Context';
import moreIcon from '../../assets/more.png';
import removeIcon from '../../assets/remove.png';

export default function BranchItems({ branches, onSelectBranch }) {
  const delBranchMutation = useDelBranchMutation();

  const removeBranch = async (branch) => {
    const { branch_tag, branch_name } = branch;
    const deleteConfirm = window.confirm(`Delete Branch ${branch_tag} ${branch_name} ?`);

    if (!deleteConfirm) {
      return;
    }

    try {
      await delBranchMutation.mutateAsync(branch_tag);
      alert(`${branch_tag} ${branch_name} deleted`);
    } catch (error) {
      console.log(error.message);
      alert(`Failed to delete ${branch_tag} ${branch_name}`);
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 50);
    }
  };

  return (
    <div className='grid lg:grid-cols-7 sm:grid-cols-2 gap-y-16 mr-4 pb-6'>
      {branches.map((branch) => (
        <BranchItem key={branch.branch_tag}
          branch={branch}
          onSelectBranch={onSelectBranch}
          onRemoveBranch={removeBranch}
        />
      ))}
    </div>
  );
};

const BranchItem = ({ branch, onSelectBranch, onRemoveBranch }) => (
  <div className='relative grid col-span-1 row-span-3 bg-slate-900/25 ml-4 hover:cursor-pointer'>

    <div onClick={() => onSelectBranch(branch.branch_tag, branch.course_tag)}>
      <img className='absolute top-0 right-0 h-6 mr-2' src={moreIcon} alt='moreIcon' />
      <p className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-sans'>{branch.branch_tag}</p>
    </div>

    <div className='justify-self-end self-end hover:bg-red-300'>
      <img
        src={removeIcon}
        alt='removeIcon'
        width='24px'
        height='24px'
        onClick={() => onRemoveBranch(branch)} // Change to pass branch_tag instead of the whole branch object
      />
    </div>

    <div className='absolute bottom-[-30px] left-0 top-[105px] text-wrap'>
      <p className='justify-self-start self-end inline-block pl-1'>
        {branch.course_tag}
      </p>
      <p>{branch.branch_name}</p>
    </div>
  </div>
);
