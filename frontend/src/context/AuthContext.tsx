import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from 'react';

// Define the shape of authentication context
type AuthResponseType = {
  email: string;
  accessToken: string;
};

interface AuthContextType {
  auth: AuthResponseType;
  setAuth: React.Dispatch<React.SetStateAction<AuthResponseType>>;
  isLoggedIn: () => boolean;
  loginFromResponse: (authResponse: AuthResponseType) => void;
  loginFromLocalStorage: () => void;
  logout: () => void;
}

// Create an Authentication Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Authentication Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [auth, setAuth] = useState<AuthResponseType>({
    email: '',
    accessToken: '',
  });

  useEffect(() => {
    loginFromLocalStorage();
  }, []);

  const isLoggedIn = useCallback(
    () => auth.accessToken !== '',
    [auth.accessToken]
  );

  function loginFromResponse(authResponse: AuthResponseType) {
    setAuth(authResponse);
    localStorage.setItem('auth', JSON.stringify(authResponse));
  }

  function loginFromLocalStorage() {
    const localAuth = localStorage.getItem('auth');
    if (!localAuth) return;

    const auth: AuthResponseType = JSON.parse(localAuth);
    setAuth(auth);
  }

  function logout() {
    localStorage.removeItem('auth');
    setAuth({ email: '', accessToken: '' });
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        isLoggedIn,
        loginFromResponse,
        loginFromLocalStorage,
        logout
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
