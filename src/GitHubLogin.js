import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LoginPage, LoginCard } from 'patternfly-react';

import brand from './images/logo-brand.svg';

import LoginCardWithValidation from './LoginCardWithValidation';

const createProps = onSubmit => ({
    container: {
        backgroundUrl: 'invalid',
        className: '',
    },
    header: {
        logoSrc: brand,
        caption: `PR-CI Dashboard requires GitHub API token in order to fetch
                  testing related data from GitHub. This token is stored in
                  browser local storage and is used only by the browser to
                  directly communicate with GitHub GraphQL API`,
    },
    card: {
        title: 'Log In to GitHub',
        form: {
            validate: true,
            submitError: 'You need to login to GitHub',
            showError: true,
            usernameField: {
                id: 'card_email',
                type: 'text',
                placeholder: 'GitHub token for API',
                errors: {
                    empty: 'Please enter your GitHub token.',
                    invalid: 'Your email is invalid',
                },
                error: 'Invalid token',
                showError: false,
            },
            passwordField: {
                id: 'card_password',
                type: 'hidden',
                placeholder: 'Not needed',
                minLength: 0,
                errors: {
                    empty: 'empty',
                    short: 'short',
                },
                warnings: {
                    capsLock: 'Caps lock is currently on.',
                },
            },
            disableSubmit: false,
            submitText: 'Log In',
            onSubmit,
        },
    },
    footerLinks: [
        {
            children: (
                <span>
                    <i className="fa fa-arrow-circle-o-right" aria-hidden="true" title="Go to token page" />
                    GitHub tokens page
                </span>
            ),
            href: 'https://github.com/settings/tokens',
            target: '_blank',
            onClick: () => false,
        },
        {
            children: (
                <span>
                    <i className="fa fa-github" aria-hidden="true" title="Runner Log" />
                    Contribute code
                </span>
            ),
            href: 'https://github.com/pvoborni/pr-ci-dashboard',
            target: '_blank',
            onClick: () => false,
        },
    ],
});


// Redefine similar component from PatternFly React project, use custom
// LoginCardWithValidation component so that we can hide and not use
// Password field
const LoginPagePattern = ({
    container, header, footerLinks, card,
}) => (
    <LoginPage.Container {...container}>
        <LoginPage.Alert {...container.alert} />
        <LoginPage.BasicLayout>
            <LoginPage.Header {...header} />
            <LoginCard.BasicLayout {...card.layout}>
                <LoginCard>
                    <LoginCard.Header>
                        <LoginCard.LanguagePicker
                            selectedLanguage={card.selectedLanguage}
                            availableLanguages={card.availableLanguages}
                            onLanguageChange={card.onLanguageChange}
                        />
                        <h1>{card.title}</h1>
                    </LoginCard.Header>
                    <LoginCardWithValidation {...card.form}>
                        <LoginCard.Form />
                    </LoginCardWithValidation>
                    <LoginCard.SignUp {...card.signUp} />
                </LoginCard>
                <LoginPage.Footer links={footerLinks} />
            </LoginCard.BasicLayout>
        </LoginPage.BasicLayout>
    </LoginPage.Container>
);

LoginPagePattern.propTypes = {
    container: PropTypes.element.isRequired,
    header: PropTypes.element.isRequired,
    footerLinks: PropTypes.element.isRequired,
    card: PropTypes.element.isRequired,
};

class GitHubLoginPage extends Component {
    onSubmit(e, state, onError) {
        const { onSubmit } = this.props;
        onSubmit(state.usernameField.value, onError);
    }

    render() {
        return (
            <LoginPagePattern
                {...createProps((e, state, onError) => {
                    this.onSubmit(e, state, onError);
                })}
            />
        );
    }
}

GitHubLoginPage.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

export default GitHubLoginPage;
