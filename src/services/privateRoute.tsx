import { Route, Redirect } from 'react-router-dom';
import React, { ReactElement } from 'react';

type PrivateRouteProps = {
  children: ReactElement;
  path: string;
};

const PrivateRoute = ({ children, ...rest }: PrivateRouteProps) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        sessionStorage.getItem('loggedIn') ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
