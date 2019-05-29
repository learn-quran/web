import React from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import Home from './Containers/Home';
import Signup from './Containers/Signup';
import Login from './Containers/Login';

import { useTranslation } from 'react-i18next';

const SignedInNavBar = () => {
  const { t } = useTranslation();
  return (
    <div className="nav-content">
      <div className="nav-item">
        <Link to="/home">{t('home')}</Link>
      </div>
    </div>
  );
};

const SignedOutNavBar = () => (
  <div className="nav-content">
    <div className="nav-item">
      <Link to="/signup">Sign Up</Link>
    </div>
    <div className="nav-item">
      <Link to="/login">Log In</Link>
    </div>
  </div>
);

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

export {
  SignedInNavBar,
  SignedOutNavBar,
  SignedInNavigation,
  SignedOutNavigation,
  Navigation,
};
