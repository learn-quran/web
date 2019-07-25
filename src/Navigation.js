import React from 'react';
import { Link, Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import Home from './Containers/Home';
import Leaderboard from './Containers/Leaderboard';
import Player from './Containers/Player';

import Account from './Components/Account';
import Landing from './Containers/Landing';

import { useTranslation } from 'react-i18next';

const SignedInNavBar = () => {
  const { t } = useTranslation();
  return (
    <div className="nav-content">
      <div className="nav-item">
        <Link to="/home">{t('home')}</Link>
      </div>
      <div className="nav-item">
        <Account />
      </div>
      <div className="nav-item">
        <Link to="/play">{t('play')}</Link>
      </div>
    </div>
  );
};

const SignedOutNavBar = () => {
  const { t } = useTranslation();
  return (
    <div className="nav-content">
      <div className="nav-item">
        <Link to="/signup">{t('sign-up')}</Link>
      </div>
      <div className="nav-item">
        <Link to="/login">{t('log-in')}</Link>
      </div>
    </div>
  );
};

const SignedInNavigation = () => (
  <Switch>
    <Route exact path="/" component={Player} />
    <Route exact path="/home" component={Home} />
    <Route exact path="/leaderboard" component={Leaderboard} />
    <Route render={() => <Redirect to="/" />} />
  </Switch>
);

const SignedOutNavigation = () => (
  <Switch>
    <Route exact path="/" component={Landing} />
    <Route exact path="/leaderboard" component={Leaderboard} />
    <Route render={() => <Redirect to="/" />} />
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
