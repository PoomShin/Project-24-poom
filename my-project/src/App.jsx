const queryClient = new QueryClient();

const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/admin', element: <Admin /> },
  { path: '/prof', element: <Prof /> }
]);

export default function App() {
  const storedUser = JSON.parse(localStorage.getItem('userData'));
  const [userContextValues, setUserContextValues] = useState(storedUser);

  return (
    <UserContext.Provider value={{ ...userContextValues, setUserContextValues }}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </UserContext.Provider>
  );
}

import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { UserContext } from "../public/context/user-context";

import Admin from './admin/Admin';
import Login from './login/Login';
import Prof from "./prof/Prof";