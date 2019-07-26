import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ScaleLoader } from 'react-spinners';

import { StylesProvider, ThemeProvider, jssPreset } from '@material-ui/styles';
import { create } from 'jss';
import rtl from 'jss-rtl';

import Firebase, { FirebaseContext } from './Firebase';
import { Navigation } from './Navigation';
import NoConnection from './Containers/NoConnection';

import './i18n';
import { withTranslation } from 'react-i18next';

import PropTypes from 'prop-types';
import * as serviceWorker from './serviceWorker';
import './Assets/stylesheets/index.scss';
import { getTheme } from './Theme';
import FAB from './Components/FAB';

class App extends React.Component {
  static propTypes = {
    firebase: PropTypes.object,
    t: PropTypes.func,
    i18n: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      user: null,
      loading: 0,
    };
  }

  componentDidMount() {
    const { firebase } = this.props;
    const language = localStorage.getItem('language') || 'en';
    document.documentElement.lang = language;
    document.body.classList.add(language === 'en' ? 'ltr' : 'rtl');
    document.body.classList.remove(language === 'en' ? 'rtl' : 'ltr');
    document.body.setAttribute('dir', language === 'en' ? 'ltr' : 'rtl');
    setTimeout(() => {
      this.connectedRef = firebase.database.ref('.info/connected');
      this.connectedRef.on('value', snap => {
        const connected = snap.val();
        this.setState({ connected, loading: connected ? 1 : -1 });
        if (connected === true) {
          this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
            firebase.isLoggedIn = !!user;
            this.setState({ loading: 2, user: user ? user : null });
          });
        }
      });
    }, 1000);
  }
  componentWillUnmount() {
    this.unsubscribe();
    this.connectedRef.off();
  }

  render() {
    const { user, loading, connected } = this.state;
    const language = localStorage.getItem('language') || 'en';
    const jss = create(
      language === 'en'
        ? {
            plugins: [...jssPreset().plugins],
          }
        : {
            plugins: [...jssPreset().plugins, rtl()],
          },
    );
    const theme = getTheme(language);

    return loading === 0 ? (
      <ScaleLoader sizeUnit={'px'} size={150} color={'#123abc'} loading />
    ) : !connected && loading === -1 ? (
      <NoConnection />
    ) : loading === 1 ? (
      <ScaleLoader sizeUnit={'px'} size={150} color={'#123abc'} loading />
    ) : (
      <Router>
        <Fragment>
          <StylesProvider jss={jss}>
            <ThemeProvider theme={theme}>
              <div className="container">
                <Navigation user={user} />
                <ToastContainer
                  position={language === 'en' ? 'top-right' : 'top-left'}
                />
                <FAB user={user} />
              </div>
            </ThemeProvider>
          </StylesProvider>
        </Fragment>
      </Router>
    );
  }
}

const WrappedApp = withTranslation()(App);

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <FirebaseContext.Consumer>
      {firebase => <WrappedApp firebase={firebase} />}
    </FirebaseContext.Consumer>
  </FirebaseContext.Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
