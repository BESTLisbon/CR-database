import React from 'react';
import { useAuth } from '../context/AuthContext';

const NavbarMain: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return <div>{isLoggedIn() ? 'Hello user' : 'Not logged in'}</div>;
};

export default NavbarMain;
