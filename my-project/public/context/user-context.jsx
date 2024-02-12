import { createContext } from "react";

export const UserContext = createContext({
    name: 'Default Name',
    role: 'Default Role',
});
