import React from 'react';
import PropTypes from 'prop-types';

import {
    Redirect,
} from 'react-router-dom';

import { authenticate } from '../gitHub';

import GitHubLogin from '../GitHubLogin';

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
        return <GitHubLogin onSubmit={(value, onError) => this.login(value, onError)} />;
    }
}

LoginWithRedirect.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    location: PropTypes.array.isRequired,
};

export default LoginWithRedirect;
