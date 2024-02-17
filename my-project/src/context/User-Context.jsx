import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export default function UserProvider({ children }) {
  const storedUser = JSON.parse(localStorage.getItem('userData')) || null;
  const [userContextValues, setUserContextValues] = useState(storedUser);

  // Update context values when user data changes
  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userContextValues));
  }, [userContextValues]);

  return (
    <UserContext.Provider value={{ userContextValues, setUserContextValues }}>
      {children}
    </UserContext.Provider>
  );
};

