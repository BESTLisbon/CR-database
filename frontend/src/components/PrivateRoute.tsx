import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Private Route Component

export const PrivateRoute: React.FC<{
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
}> = ({ component: Component, ...rest }) => {
  const { isLoggedIn } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => isLoggedIn() ? <Component {...props} /> : <Redirect to='/login' />} />
  );
};
