import waitingIcon from '../../assets/more.png';
import acceptIcon from '../../assets/accept.png';
import rejectIcon from '../../assets/decline.png';

export const statusMappings = {
    waiting: { icon: waitingIcon, bgColor: 'bg-gray-200' },
    accept: { icon: acceptIcon, bgColor: 'bg-green-200' },
    reject: { icon: rejectIcon, bgColor: 'bg-red-200' },
    default: { icon: waitingIcon, bgColor: 'bg-gray-200' }
};
