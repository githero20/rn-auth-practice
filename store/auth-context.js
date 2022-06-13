import { createContext, useState } from "react";

export const AuthContext = createContext({
  token: "",
  isAuthenticated: false,
  authenticate: () => {},
  logout: () => {},
});
// This is literally a HOC because it takes a component (children) and returns another component, i.e. children wrapped with a context provider
const AuthContextProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState("");

  const authenticate = (token) => {
    setAuthToken(token);
  };

  const logout = () => {
    setAuthToken(null);
  };

  //   this is what will be passed to the context HOC, it must match the
  const value = {
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate,
    logout,
  };

  return <AuthContextProvider value={value}>{children}</AuthContextProvider>;
};

export default AuthContextProvider;
