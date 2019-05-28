import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';
import PropTypes from 'prop-types';

import Firebase, { FirebaseContext } from './Firebase';
import { NavBar, Navigation } from './Navigation';

import * as serviceWorker from './serviceWorker';

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

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <FirebaseContext.Consumer>
      {firebase => <App firebase={firebase} />}
    </FirebaseContext.Consumer>
  </FirebaseContext.Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
