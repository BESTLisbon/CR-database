import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthResponseType } from '../models/auth';

// Private Route Component

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
  condition?: (state: AuthResponseType | undefined) => boolean;
  redirectTo?: string;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  condition,
  redirectTo = '/login',
  ...rest
}) => {
  const { state } = useAuth();

  function getCondition() {
    if (!condition) return !!state;
    return condition(state);
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        getCondition() ? <Component {...props} /> : <Redirect to={redirectTo} />
      }
    />
  );
};
