import React, { Component } from 'react';
import './App.css';
import { Route, Redirect, withRouter, Switch } from "react-router-dom";

import {
  VerticalNav,
  VerticalNavItem,
  VerticalNavMasthead,
  VerticalNavBrand,
  Grid
} from 'patternfly-react';

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
                <Route path="/prs" component={PRs} />
                <Route path="/nightlies" component={Nighlies} />
                <Route path="/jobs" component={Jobs} />
                <Redirect exact from="/" to="/prs" />
            </Switch>

        </div>
    );
  }
}
App = withRouter(App);
export default App;
