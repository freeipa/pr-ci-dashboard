import React, { Component } from 'react';
import './App.css';
import { Route, Redirect, withRouter, Switch } from "react-router-dom";
import { authenticate, isAuthenticated} from './gitHub'

import {
  VerticalNav,
  VerticalNavItem,
  VerticalNavMasthead,
  VerticalNavBrand,
  Grid
} from 'patternfly-react';

import GitHubLogin from './GitHubLogin';

import pfLogo from 'patternfly/dist/img/logo-alt.svg';
import pfBrand from 'patternfly/dist/img/brand-alt.svg';

const Content = (props) => {
    return <Grid fluid className="container-pf-nav-pf-vertical">
        <Grid.Row>
            <Grid.Col xs={12}>
                {props.children}
            </Grid.Col>
        </Grid.Row>
    </Grid>
}

const PRs = () => <Content><h2>Pull Requests</h2></Content>;
const Nighlies = () => <Content><h2>Nighlies</h2></Content>;
const Jobs = () => <Content><h2>Jobs</h2></Content>;

function PrivateRoute({ component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated() ? (
                    <Component {...props} />
                ) : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: props.location }
                            }}
                        />
                    )
            }
        />
    );
}

class LoginWithRedirect extends React.Component {
    state = { redirectToReferrer: false };

    login = (value, onError) => {
        var that = this;
        authenticate(value).then(result => {
            if (result) {
                that.setState({ redirectToReferrer: true });
            } else {
                onError("Authentication failed: probably wrong token");
            }
        }).catch(error => onError(error.message));
    };

    render() {
        let { from } = this.props.location.state || { from: { pathname: "/" } };
        let { redirectToReferrer } = this.state;

        if (redirectToReferrer) return <Redirect to={from} />;
        return <GitHubLogin onSubmit={this.login} />
    }
}

class App extends Component {
  constructor() {
    super();
    this.menu = [{
      to: "/prs",
      title: "Pull Requests",
      iconClass: "fa fa-code-fork"
    },
    {
      to: "/nightlies",
      title: "Nighly runs",
      iconClass: "fa fa-moon-o"
    },
    {
      to: "/jobs",
      title: "Jobs",
      iconClass: "fa fa-wrench"
    }]
  }

  render() {

    const history = this.props.history;
    const vertNavItems = this.menu.map(item => (
      <VerticalNavItem
        key={item.to}
        title={item.title}
        iconClass={item.iconClass}
        active={history.location.pathname === item.to}
        onClick={() => {
            history.push(item.to);
        }}
      >
      </VerticalNavItem>
    ));

    return (
        <div>
            <VerticalNav persistentSecondary={false}>
                <VerticalNavMasthead>
                    <VerticalNavBrand titleImg={pfBrand} iconImg={pfLogo} />
                </VerticalNavMasthead>
                {vertNavItems}
            </VerticalNav>

            <Switch>
                <PrivateRoute path="/prs" component={PRs} />
                <Route path="/nightlies" component={Nighlies} />
                <Route path="/jobs" component={Jobs} />
                <Route path="/login" component={LoginWithRedirect} />
                <Redirect exact from="/" to="/prs" />
            </Switch>

        </div>
    );
  }
}
App = withRouter(App);
export default App;
