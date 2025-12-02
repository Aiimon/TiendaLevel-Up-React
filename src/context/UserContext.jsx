import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext();

export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  return (
    <UserContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UserContext.Provider>
  );
}
