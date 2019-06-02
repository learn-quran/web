import React from 'react';
import PropTypes from 'prop-types';
import { withFirebase } from '../Firebase';

const Home = ({ firebase }) => (
  <button onClick={() => firebase.auth().signOut()} type="button">
    SIGN OUT
  </button>
);
Home.propTypes = {
  firebase: PropTypes.object,
};

export default withFirebase(Home);
