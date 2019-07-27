import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import Leaderboard from './Containers/Leaderboard';
import Player from './Containers/Player';

import Landing from './Containers/Landing';

const Navigation = ({ user }) => (
  <Switch>
    <Route exact path="/" component={user ? Player : Landing} />
    <Route exact path="/leaderboard" component={Leaderboard} />
    <Route render={() => <Redirect to="/" />} />
  </Switch>
);
Navigation.propTypes = {
  user: PropTypes.object,
};

export { Navigation };
