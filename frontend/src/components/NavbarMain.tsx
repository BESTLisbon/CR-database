import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const NavbarMain: React.FC = () => {
  const { state, logout } = useAuth();

  return (
    <>
      {state?.user ? (
        <div>
          <h4>Hello {state.user.name}</h4>
          <button onClick={() => logout()}>Logout</button>
        </div>
      ) : (
        <h4>Not logged in</h4>
      )}
      <div style={{display: "flex", flexDirection: "row", gap: "5px", margin: "10px 0px"}}>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/invite">Invite</Link>
      </div>
    </>
  );
};

export default NavbarMain;
