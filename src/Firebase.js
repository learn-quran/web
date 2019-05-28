/* eslint-disable react/display-name */
import React from 'react';
import app from 'firebase/app';

// Firebase dependencies
import 'firebase/auth';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
  }

  signIn = ({ email, password }) => {
    return new Promise((resovle, reject) => {
      this.auth
        .signInWithEmailAndPassword(email, password)
        .then(() => resovle())
        .catch(({ code, message }) => {
          let error = null;
          switch (code) {
            case 'auth/email-already-in-use':
              error = 'This email address has already been taken';
              break;
            case 'auth/user-disabled':
              error = 'Your account has been disabled';
              break;
            case 'auth/user-not-found':
            case 'auth/wrong-password':
              error = 'Credintials are incorrect';
              break;
            default:
              error = 'Check your internet connection';
          }
          reject(error || message);
        });
    });
  };
}

const FirebaseContext = React.createContext(null);

const withFirebase = Component => props => (
  <FirebaseContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
);

export { FirebaseContext, withFirebase };
export default Firebase;
