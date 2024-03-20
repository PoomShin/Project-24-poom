import { useState, createContext, useContext, useMemo, useEffect } from 'react';

export const UserContext = createContext();

export default function UserProvider({ children }) {
  const [userContextValues, setUserContextValues] = useState(() => {
    try {
      const storedUserContextValues = localStorage.getItem('userContextValues');
      return storedUserContextValues ? JSON.parse(storedUserContextValues) : null;
    } catch (error) {
      console.error('Error retrieving user context values from localStorage:', error);
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('userContextValues', JSON.stringify(userContextValues));
    } catch (error) {
      console.error('Error storing user context values in localStorage:', error);
    }
  }, [userContextValues]);

  const contextValue = { userContextValues, setUserContextValues };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
