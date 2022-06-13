import { createContext, useState, useEffect } from "react";
import { AsyncStorage } from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({
  token: "",
  isAuthenticated: false,
  authenticate: () => {},
  logout: () => {},
  // expTime: 60 * 60 * 1000,
});

// This is literally a HOC because it takes a component (children) and returns another component, i.e. children wrapped with a context provider
const AuthContextProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState("");

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  // const AuthVerify = () => {
  //   const token = JSON.parse(AsyncStorage.getItem("token"));

  //   const decodedJwt = parseJwt(token);
  //   if (decodedJwt.exp * 1000 < Date.now()) {
  //     setAuthToken(null);
  //     AsyncStorage.removeItem("token");
  //   }
  // };

  // accepts the token, whether from async storage or fetch, it doesn't care
  const authenticate = (token) => {
    // decodes it and checks if its already expired. If it is, it logs out.
    const decodedJwt = parseJwt(token);
    if (decodedJwt.exp * 1000 < Date.now()) {
      setAuthToken(null);
      AsyncStorage.removeItem("token");
    } else {
      setAuthToken(token);
      AsyncStorage.setItem("token", token);
      // const endDate = new Date(decodedJwt.exp * 1000);
      console.log(decodedJwt.exp * 1000);
    }
  };

  const logout = () => {
    setAuthToken(null);
    AsyncStorage.removeItem("token");
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
