import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import Home from './Containers/Home';
import Leaderboard from './Containers/Leaderboard';
import Player from './Containers/Player';

import Landing from './Containers/Landing';

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

export { SignedInNavigation, SignedOutNavigation, Navigation };
