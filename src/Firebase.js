/* eslint-disable react/display-name */
import React from 'react';
import app from 'firebase/app';
import moment from 'moment';

// Firebase dependencies
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

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
    this.storage = app.storage;
    this.isLoggedIn = false;
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
  createUser = ({ email, password, username, language }) =>
    new Promise((resolve, reject) => {
      this.isUsernameDuplicated(username)
        .then(() => {
          this.auth()
            .createUserWithEmailAndPassword(email, password)
            .then(({ user }) => {
              if (user && user.uid) {
                let updates = {};
                updates['users/private/' + user.uid] = {
                  uid: user.uid,
                  email: email,
                  language: language,
                  username: username,
                  points: 0,
                  lastPlayed: 'never-played',
                  createdAt: moment()
                    .locale('en')
                    .format(),
                };
                updates['users/public/' + user.uid] = {
                  username: username,
                  points: 0,
                  lastPlayed: 'never-played',
                };
                this.database.ref().update(updates);
                resolve();
              }
            })
            .catch(({ code, message }) => {
              reject(this.getErrorMessage(code) || message);
            });
        })
        .catch(err => reject(err));
    });
  resetPassword = (email, lang) =>
    new Promise((resolve, reject) => {
      const auth = this.auth();
      auth.languageCode = lang;
      auth
        .sendPasswordResetEmail(email)
        .then(() => resolve())
        .catch(error => reject(error.message));
    });
  getUser = () =>
    new Promise((resolve, reject) => {
      this.database
        .ref(`users/private/${this.auth().currentUser.uid}`)
        .once('value')
        .then(snapshot => {
          resolve(snapshot.val());
        })
        .catch(error => reject(error.message));
    });
  isUsernameDuplicated = username =>
    new Promise((resolve, reject) => {
      this.database
        .ref('users/public')
        .orderByChild('username')
        .equalTo(username)
        .once('value')
        .then(snapshot => {
          if (snapshot.val()) {
            reject('username-already-exists');
          } else {
            resolve();
          }
        })
        .catch(({ code, message }) => {
          reject(this.getErrorMessage(code) || message);
        });
    });
  getLeaderboard = () =>
    new Promise((resolve, reject) => {
      this.database
        .ref('users/public')
        .orderByChild('points')
        .once('value')
        .then(snapshot => {
          resolve(snapshot.val());
        });
    });
  updateUserOnDB = (_updates, _public = false, _private = true) =>
    new Promise((resolve, reject) => {
      if (!_public && !_private) return;
      const { uid } = this.auth().currentUser;
      const promises = [];
      if (_public)
        promises.push(
          this.database.ref(`users/public/${uid}`).update(_updates),
        );
      if (_private)
        promises.push(
          this.database.ref(`users/private/${uid}`).update(_updates),
        );
      Promise.all(promises)
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
  getAsset = assetId =>
    new Promise((resolve, reject) => {
      this.storage()
        .ref(`audio/${assetId}.mp3`)
        .getDownloadURL()
        .then(url => resolve(url))
        .catch(({ code, message }) => {
          reject(this.getErrorMessage(code) || message);
        });
    });
  updateUserPoints = newPoints =>
    new Promise((resolve, reject) => {
      this.getUser()
        .then(({ points }) => {
          this.updateUserOnDB({ points: points + newPoints }, true)
            .then(() => resolve())
            .catch(() => reject());
        })
        .catch(() => reject());
    });
  updateUserLastPlayed = lastPlayed =>
    new Promise(() => {
      this.getUser()
        .then(({ points }) => {
          this.updateUserOnDB({ lastPlayed }, true)
            .then(() => {})
            .catch(() => {});
        })
        .catch(() => {});
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
