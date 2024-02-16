const queryClient = new QueryClient();

const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/admin', element: <Admin /> },
  { path: '/prof', element: <Prof /> }
]);

export default function App() {
  return (
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </UserProvider>
  );
}

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import UserProvider from "./context/User-Context";

import Admin from './admin/Admin';
import Login from './login/Login';
import Prof from "./prof/Prof";