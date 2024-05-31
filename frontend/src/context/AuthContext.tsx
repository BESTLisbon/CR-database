import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Route, Redirect } from 'react-router-dom';

// Define the shape of authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  updateAuthStatus: (status: boolean) => void;
}

// Create an Authentication Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Authentication Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem('token')
  );

  // Function to update authentication status
  const updateAuthStatus = (status: boolean) => {
    setIsAuthenticated(status);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, updateAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Private Route Component
export const PrivateRoute: React.FC<{
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
}> = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};
