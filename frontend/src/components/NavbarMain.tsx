import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

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
      <div style={{display: "flex", flexDirection: "row", gap: "5px", margin: "10px 0px"}}>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/invite">Invite</Link>
      </div>
    </>
  );
};

export default NavbarMain;
