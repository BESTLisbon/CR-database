import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { AuthResponseType } from '../models/auth';
import { axiosInstance } from '../config/axiosInstance';

interface AuthContextType {
  state: AuthResponseType | undefined;
  setState: React.Dispatch<React.SetStateAction<AuthResponseType | undefined>>;
  loginFromResponse: (authResponse: AuthResponseType) => void;
  loginFromLocalStorage: () => void;
  logout: () => void;
  refresh: () => Promise<void>;
}

// Create an Authentication Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Authentication Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthResponseType | undefined>(undefined);

  useEffect(() => {
    loginFromLocalStorage();
  }, []);

  function loginFromResponse(authResponse: AuthResponseType) {
    setState(authResponse);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
    localStorage.setItem('auth', JSON.stringify(authResponse.auth));
  }

  function loginFromLocalStorage() {
    const localUser = localStorage.getItem('user');
    const localAuth = localStorage.getItem('auth');
    if (!localAuth || !localUser) return;
    
    const newState: AuthResponseType = {
      auth: JSON.parse(localAuth),
      user: JSON.parse(localUser),
    };
    setState(newState);
  }

  function logout() {
    localStorage.removeItem('auth');
    localStorage.removeItem('user');
    setState(undefined);
  }

  async function refresh() {
    const refreshToken = state?.auth.refreshToken;
    if (!refreshToken) return;

    const response = await axiosInstance.post(
      '/auth/refresh',
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
        skipAuthInterceptor: true,
      }
    );
    if (response.status === 200) {
      localStorage.setItem(
        'auth',
        JSON.stringify({
          ...JSON.parse(localStorage.getItem('auth')!),
          accessToken: response.data.access_token,
        })
      );
      loginFromLocalStorage(); // Get the new info into state
    } else {
      console.error(response.status, response.data);
      logout();
    }
  }

  return (
    <AuthContext.Provider
      value={{
        state: state,
        setState: setState,
        loginFromResponse,
        loginFromLocalStorage,
        logout,
        refresh,
      }}
    >
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
