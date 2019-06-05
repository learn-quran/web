/* eslint-disable react/display-name */
import React from 'react';
import app from 'firebase/app';

// Firebase dependencies
import 'firebase/auth';
import 'firebase/database';

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

    this.auth = app.auth;
    this.database = app.database();
  }

  errors = [
    'check-your-internet-connection',
    'auth/email-already-in-use',
    'auth/user-disabled',
    'auth/user-not-found',
    'auth/wrong-password',
    'auth/email-already-in-use',
    'auth/invalid-email',
    'auth/weak-password',
    'username-already-exists',
    'an-error-occured-please-try-again-later',
    'auth/requires-recent-login',
    'auth/user-mismatch',
    'auth/user-not-found',
    'auth/invalid-credential',
  ];

  getErrorMessage = code =>
    this.errors.includes(code) ? code : 'check-your-internet-connection';

  signIn = ({ email, password }) =>
    new Promise((resovle, reject) => {
      this.auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => resovle())
        .catch(({ code, message }) => {
          reject(this.getErrorMessage(code) || message);
        });
    });
  createUser = ({ email, password, username }) =>
    new Promise((resolve, reject) => {
      this.database
        .ref('users')
        .orderByChild('username')
        .equalTo(username)
        .once('value')
        .then(snapshot => {
          if (snapshot.val()) {
            reject('username-already-exists');
          } else {
            this.auth()
              .createUserWithEmailAndPassword(email, password)
              .then(({ user }) => {
                if (user && user.uid) {
                  let updates = {};
                  updates['users/' + user.uid] = {
                    uid: user.uid,
                    username: username,
                    email: email,
                    points: 0,
                    lastPlayed: '3 days ago',
                    isEmailVerified: false,
                  };
                  this.database.ref().update(updates);
                  resolve();
                }
              })
              .catch(({ code, message }) => {
                reject(this.getErrorMessage(code) || message);
              });
          }
        });
    });
  getUser = () =>
    new Promise((resolve, reject) => {
      this.database
        .ref(`users/${this.auth().currentUser.uid}`)
        .once('value')
        .then(snapshot => {
          resolve({
            ...snapshot.val(),
          });
        })
        .catch(error => reject(error.message));
    });
  getLeaderboard = () =>
    new Promise((resolve, reject) => {
      this.database
        .ref('users')
        .orderByChild('points')
        .once('value')
        .then(snapshot => {
          resolve(snapshot.val());
        });
    });
  updateUserOnDB = updates =>
    new Promise((resolve, reject) => {
      this.database
        .ref(`users/${this.auth().currentUser.uid}`)
        .update(updates)
        .then(() => resolve())
        .catch(() => reject('an-error-occured-please-try-again-later'));
    });
  updateUserEmail = email =>
    new Promise((resolve, reject) => {
      this.auth()
        .currentUser.updateEmail(email)
        .then(() => this.updateUserOnDB({ email }).then(() => resolve()))
        .catch(({ code, message }) => {
          reject(this.getErrorMessage(code) || message);
        });
    });
  updateUserPassword = password =>
    new Promise((resolve, reject) => {
      this.auth()
        .currentUser.updatePassword(password)
        .then(() => resolve())
        .catch(({ code, message }) => {
          reject(this.getErrorMessage(code) || message);
        });
    });
  reauthenticate = password =>
    new Promise((resolve, reject) => {
      const user = this.auth().currentUser;
      const credintial = this.auth.EmailAuthProvider.credential(
        user.email,
        password,
      );
      user
        .reauthenticateWithCredential(credintial)
        .then(() => resolve())
        .catch(({ code, message }) => {
          reject(this.getErrorMessage(code) || message);
        });
    });
}

const FirebaseContext = React.createContext(null);

const withFirebase = Component => props => (
  <FirebaseContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
);

export { FirebaseContext, withFirebase };
export default Firebase;
