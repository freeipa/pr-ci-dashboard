import React, { Component } from 'react';
import { LoginPage, LoginCard } from 'patternfly-react';
import LoginCardWithValidation from './LoginCardWithValidation'

import pfLogo from 'patternfly/dist/img/logo.svg';
import pfBrand from 'patternfly/dist/img/brand.svg';

const createProps = (onSubmit) => {
    return {
        container: {
            backgroundUrl:"",
            className: ""
        },
        header: {
            logoSrc: pfBrand,
            logoTitle: pfLogo,
            caption: ""
        },
        card: {
            title: "Log In to GitHub",
            form: {
                validate: true,
                submitError: "You need to login to GitHub",
                showError: true,
                usernameField: {
                    id: "card_email",
                    type: "text",
                    placeholder: 'GitHub token for API',
                    errors: {
                        empty: 'Please enter your GitHub token.',
                        invalid: 'Your email is invalid'
                    },
                    error: 'Invalid token',
                    showError: false
                },
                passwordField: {
                    id: "card_password",
                    type: "hidden",
                    placeholder: "Not needed",
                    minLength: 0,
                    errors: {
                        empty: 'empty',
                        short: 'short'
                    },
                    warnings: {
                        capsLock: 'Caps lock is currently on.'
                    }
                },
                disableSubmit: false,
                submitText: "Log In",
                onSubmit: onSubmit
            }
        }
    };
};

// Redefine similar component from PatternFly React project, use custom
// LoginCardWithValidation component so that we can hide and not use
// Password field
const LoginPagePattern = ({ container, header, footerLinks, card }) => (
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

class GitHubLoginPage extends Component {

    onSubmit = (e, state, onError) => {
        let submit = this.props.onSubmit
        submit(state.usernameField.value, onError);
    };

    render() {
        return (
            <LoginPagePattern {...createProps(this.onSubmit)} />
        );
    }
}

export default GitHubLoginPage;