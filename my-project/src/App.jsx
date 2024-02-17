const queryClient = new QueryClient();

const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/admin', element: <Admin /> },
  { path: '/prof', element: <Prof /> },
  { path: '/Poom', element: <Prof_Layout /> }
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
import Prof_Layout from "./Poom/Prof_Layout";
