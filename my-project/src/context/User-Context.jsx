import React, { createContext, useState } from 'react';

export const UserContext = createContext(); //this have context value

export default function UserProvider({ children }) {
  const storedUser = JSON.parse(localStorage.getItem('userData')) || null;
  //console.log(storedUser);
  const [userContextValues, setUserContextValues] = useState(storedUser);

  return (
    <UserContext.Provider value={{ userContextValues, setUserContextValues }}>
      {children}
    </UserContext.Provider>
  );
};