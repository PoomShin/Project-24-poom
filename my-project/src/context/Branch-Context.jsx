import { createContext, useContext } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

const BranchContext = createContext();

export const BranchProvider = ({ children }) => {
    const { data: branches, isLoading, isError } = useQuery(
        'branchTags',
        async () => {
            const response = await axios.get('/api/branches');
            return response.data;
        }
    );

    return (
        <BranchContext.Provider value={{ branches }}>
            {children}
        </BranchContext.Provider>
    );
};

export const useBranchesContext = () => useContext(BranchContext);
