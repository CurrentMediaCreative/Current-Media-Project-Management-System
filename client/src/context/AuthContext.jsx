import { createContext, useContext } from "react";

// Create the auth context
const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

// Auth provider component
export const AuthProvider = ({ children, value }) => {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
