/* eslint-disable react/prop-types */
import React from 'react';
import {
    Route, Redirect,
} from 'react-router-dom';
import { isAuthenticated } from '../gitHub';

function PrivateRoute({ component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) => {
                if (isAuthenticated()) {
                    return <Component {...props} />;
                }
                return (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: { from: props.location },
                        }}
                    />
                );
            }
            }
        />
    );
}

export default PrivateRoute;
