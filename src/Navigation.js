import React from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import Home from './Containers/Home';
import Signup from './Containers/Signup';
import Login from './Containers/Login';

const SignedInNavBar = () => (
  <ul>
    <li>
      <Link to="/home">Home</Link>
    </li>
  </ul>
);

const SignedOutNavBar = () => (
  <ul>
    <li>
      <Link to="/login">Sign In</Link>
    </li>
  </ul>
);

const NavBar = ({ user }) => (
  <div>{user ? <SignedInNavBar /> : <SignedOutNavBar />}</div>
);
NavBar.propTypes = {
  user: PropTypes.object,
};
const SignedInNavigation = () => (
  <Switch>
    <Route path="/home" component={Home} />
    <Route render={() => <Redirect to="/home" />} />
  </Switch>
);

const SignedOutNavigation = () => (
  <Switch>
    <Route path="/signup" component={Signup} />
    <Route path="/login" component={Login} />
    <Route render={() => <Redirect to="/signup" />} />
  </Switch>
);

const Navigation = ({ user }) => {
  return user ? <SignedInNavigation /> : <SignedOutNavigation />;
};
Navigation.propTypes = {
  user: PropTypes.object,
};

export { NavBar, Navigation };
