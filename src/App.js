import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import { ScaleLoader } from 'react-spinners';

import { withFirebase } from './Firebase';
import { NavBar, Navigation } from './Navigation';

class App extends React.Component {
  static propTypes = {
    firebase: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: true,
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.firebase.auth.onAuthStateChanged(user => {
      this.setState({ loading: false });
      user ? this.setState({ user }) : this.setState({ user: null });
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { user, loading } = this.state;
    return loading ? (
      <ScaleLoader
        sizeUnit={'px'}
        size={150}
        color={'#123abc'}
        loading={loading}
      />
    ) : (
      <Router>
        <Fragment>
          <NavBar user={user} />

          <Navigation user={user} />
        </Fragment>
      </Router>
    );
  }
}

export default withFirebase(App);
