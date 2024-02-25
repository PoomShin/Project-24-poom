import { useState, createContext, useContext, useEffect, useMemo } from 'react';

export const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export default function UserProvider({ children }) {
  const storedUser = useMemo(() => {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
  }, []);

  const [userContextValues, setUserContextValues] = useState(storedUser);

  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userContextValues));
  }, [userContextValues]);

  const contextValue = useMemo(() => ({ userContextValues, setUserContextValues }), [userContextValues, setUserContextValues]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
