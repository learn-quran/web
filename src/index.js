import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { StylesProvider, ThemeProvider, jssPreset } from '@material-ui/styles';
import { create } from 'jss';
import rtl from 'jss-rtl';

import Firebase, { FirebaseContext } from './Firebase';
import { Navigation } from './Navigation';
import MonitorConnection from './Containers/MonitorConnection';
import './i18n';
import { withTranslation } from 'react-i18next';
import * as moment from 'moment';

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
      noConnection: false,
      user: null,
      loading: true,
    };
    this.connectedRef = props.firebase.database.ref('.info/connected');
  }

  componentDidMount() {
    if (!localStorage.getItem('language'))
      localStorage.setItem('language', 'en');
    const { firebase, i18n } = this.props;
    const language = localStorage.getItem('language');
    document.documentElement.lang = language;
    document.body.classList.add(language === 'en' ? 'ltr' : 'rtl');
    document.body.classList.remove(language === 'en' ? 'rtl' : 'ltr');
    document.body.setAttribute('dir', language === 'en' ? 'ltr' : 'rtl');
    moment.locale(language);
    setTimeout(() => {
      this.connectedRef.on('value', snap => {
        const connected = snap.val();
        clearTimeout(this.connectionTimer);
        this.setState({ loading: true, noConnection: false });
        if (connected === true) {
          this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
            firebase.isLoggedIn = !!user;
            this.setState({ loading: false, user: user ? user : null });
            if (user) {
              firebase.getUser().then(({ language: userLanguage }) => {
                if (
                  language !== userLanguage ||
                  i18n.language !== userLanguage
                ) {
                  i18n.changeLanguage(userLanguage).then(() => {
                    localStorage.setItem('language', userLanguage);
                    window.location.reload();
                  });
                }
              });
            }
          });
        } else {
          this.connectionTimer = setTimeout(
            () => this.setState({ noConnection: true, loading: false }),
            5000,
          );
        }
      });
    }, 1000);
  }
  componentWillUnmount() {
    this.unsubscribe();
    this.connectedRef.off();
  }

  render() {
    const { user, loading, noConnection } = this.state;
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

    return (
      <MonitorConnection noConnection={noConnection} loading={loading}>
        <Router>
          <Fragment>
            <StylesProvider jss={jss}>
              <ThemeProvider theme={theme}>
                <Navigation user={user} />
                <ToastContainer
                  position={language === 'en' ? 'top-right' : 'top-left'}
                />
                <FAB user={user} />
              </ThemeProvider>
            </StylesProvider>
          </Fragment>
        </Router>
      </MonitorConnection>
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
