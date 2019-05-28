import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { withFirebase } from '../Firebase';

import '../Assets/stylesheets/Signup.scss';

const SignupSchema = Yup.object().shape({
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password too short'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email'),
});

const Signup = ({ firebase }: Object) => {
  const [isSubmitting, changeIsSubmitting] = useState(false);
  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      onSubmit={values => {
        changeIsSubmitting(true);
        SignupSchema.validate(values, {
          strict: true,
          stripUnknown: true,
        })
          .then(() => {
            firebase.auth
              .createUserWithEmailAndPassword(values.email, values.password)
              .then(() => <Redirect to={{ pathname: '/' }} />)
              .catch(function(err) {
                let error = null;
                switch (err.code) {
                  case 'auth/email-already-in-use':
                    error = 'This email address has already been taken';
                    break;
                  case 'auth/invalid-email':
                    error = 'Invalid e-mail address format';
                    break;
                  case 'auth/weak-password':
                    error = 'Password too weak';
                    break;
                  default:
                    error = 'Check your internet connection';
                }
                toast.error(error || err.message);
                changeIsSubmitting(false);
              });
          })
          .catch(err => {
            toast.error(err);
            changeIsSubmitting(false);
          });
      }}
      render={({ values, handleBlur, handleChange, handleSubmit }) => (
        <form onSubmit={handleSubmit} autoCapitalize="off" autoComplete="off">
          <div className="form-container">
            <div className="text-field-container">
              <TextField
                id="email"
                label="Email "
                type="email"
                className="text-field"
                value={values.email}
                onChange={handleChange('email')}
                onBlur={handleBlur('email')}
                margin="normal"
                variant="outlined"
              />
              <TextField
                id="password"
                type="password"
                label="Password "
                className="text-field"
                value={values.password}
                onChange={handleChange('password')}
                onBlur={handleBlur('password')}
                margin="normal"
                variant="outlined"
              />
            </div>
            <div className="button-container">
              <Button
                variant="contained"
                color="primary"
                className="button"
                onClick={handleSubmit}
                disabled={isSubmitting}>
                Sign up
              </Button>
            </div>
          </div>
        </form>
      )}
    />
  );
};

export default withFirebase(Signup);
