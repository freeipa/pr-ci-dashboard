import React, { Component } from 'react';
import Content from './Content';
import './App.css';

import {
  VerticalNav,
  VerticalNavItem,
  VerticalNavMasthead,
  VerticalNavBrand
} from 'patternfly-react';

import pfLogo from 'patternfly/dist/img/logo-alt.svg';
import pfBrand from 'patternfly/dist/img/brand-alt.svg';
/* import { patternfly } from 'patternfly-react/dist/js/common/patternfly'; */

class App extends Component {
  constructor() {
    super();
    this.menu = [{
      to: "key",
      title: "My menu Item",
      iconClass: "key",
      active: true
    },
    {
      to: "key2",
      title: "Item 2",
      iconClass: "success",
      active: true
    }]
  }

  render() {

    const vertNavItems = this.menu.map(item => (
      <VerticalNavItem
        key={item.to}
        title={item.title}
        iconClass={item.iconClass}
        active={false}
        onClick={() => this.navigateTo(item.to)}
      >
      </VerticalNavItem>
    ));


    return (
      /*       <div className="App">
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 className="App-title">Welcome to React</h1>
              </header>
              <p className="App-intro">
                To get started, edit <code>src/App.js</code> and save to reload.
              </p>
            </div> */
      <React.Fragment>
        <VerticalNav persistentSecondary={false}>
          <VerticalNavMasthead>
            <VerticalNavBrand titleImg={pfBrand} iconImg={pfLogo} />
          </VerticalNavMasthead>
          {vertNavItems}
          {/* <VerticalNavItem
          key="abc"
          title="Ipsum"
          iconClass="fa fa-dashboard"
          active
          onClick={() => this.navigateTo('/')}
        /> */}
        </VerticalNav>
        <Content />
        {/*  {this.renderContent()} */}
      </React.Fragment>
    );
  }
}

export default App;
