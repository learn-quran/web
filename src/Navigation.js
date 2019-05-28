import React from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom';

import * as ROUTES from './Constants';

import Home from './Containers/Home';
import Signup from './Containers/Signup';
import Login from './Containers/Login';

const SignedInNavBar = () => (
  <ul>
    <li>
      <Link to={ROUTES.HOME}>Home</Link>
    </li>
  </ul>
);

const SignedOutNavBar = () => (
  <ul>
    <li>
      <Link to={ROUTES.SIGN_IN}>Sign In</Link>
    </li>
  </ul>
);

const NavBar = ({ user }: Object) => (
  <div>{user ? <SignedInNavBar /> : <SignedOutNavBar />}</div>
);

const SignedInNavigation = () => (
  <Switch>
    <Route exact path="/" render={() => <Redirect to="/home" />} />
    <Route path="/home" component={Home} />
    <Route render={() => <Redirect to="/home" />} />
  </Switch>
);

const SignedOutNavigation = () => (
  <Switch>
    <Route exact path="/" render={() => <Redirect to="/signup" />} />
    <Route path="/signup" component={Signup} />
    <Route path="/login" component={Login} />
    <Route render={() => <Redirect to="/signup" />} />
  </Switch>
);

const Navigation = ({ user }: Object) => {
  return user ? <SignedInNavigation /> : <SignedOutNavigation />;
};

export { NavBar, Navigation };
