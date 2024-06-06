import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Private Route Component

export const PrivateRoute: React.FC<{
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
}> = ({ component: Component, ...rest }) => {
  const { state } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => state ? <Component {...props} /> : <Redirect to='/login' />} />
  );
};
