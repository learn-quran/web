import React from 'react';
import { withFirebase } from '../Firebase';

const Home = ({ firebase }: Object) => (
  <button onClick={() => firebase.auth.signOut()} type="button">
    SIGN OUT
  </button>
);

export default withFirebase(Home);
