import React from 'react';
import PropTypes from 'prop-types';

import {
    Redirect,
} from 'react-router-dom';

import { authenticate } from '../gitHub';
import { LoginPage, LoginCard } from 'patternfly-react';
import GitHubLogin from '../GitHubLogin';
import OpenShiftLogo from './OpenShiftLogo';

class LoginWithRedirect extends React.Component {
    constructor() {
        super();
        this.state = { redirectToReferrer: false };
    }

    login(value, onError) {
        const that = this;
        authenticate(value).then((result) => {
            if (result) {
                that.setState({ redirectToReferrer: true });
            } else {
                onError('Authentication failed: probably wrong token');
            }
        }).catch(error => onError(error.message));
    }

    render() {
        const { location } = this.props;
        const { from } = location.state || { from: { pathname: '/' } };
        const { redirectToReferrer } = this.state;

        if (redirectToReferrer) return <Redirect to={from} />;
        return (
            <React.Fragment>
                <GitHubLogin onSubmit={(value, onError) => this.login(value, onError)} />
                <div>
                Foo
                </div>
                {OpenShiftLogo()}
            </React.Fragment>
        );
    }
}

LoginWithRedirect.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    location: PropTypes.array.isRequired,
};

export default LoginWithRedirect;
