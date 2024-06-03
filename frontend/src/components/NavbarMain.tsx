import React from 'react';
import { useAuth } from '../context/AuthContext';

const NavbarMain: React.FC = () => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <>
      {isLoggedIn() ? (
        <div>
          <h4>Hello user</h4>
          <button onClick={() => logout()}>Logout</button>
        </div>
      ) : (
        <h4>Not logged in</h4>
      )}
    </>
  );
};

export default NavbarMain;
