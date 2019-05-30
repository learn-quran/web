import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import PropTypes from 'prop-types';
import { withFirebase } from '../Firebase';

import '../Assets/stylesheets/Signup.scss';

const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password too short'),
  passwordConfirmation: Yup.string().required(
    'Password confirmation is required',
  ),
});

const Signup = ({ firebase }) => {
  const [isSubmitting, changeIsSubmitting] = useState(false);
  const submit = values => {
    if (values.password !== values.passwordConfirmation) {
      toast.error("Passwords don't match");
    } else {
      changeIsSubmitting(true);
      SignupSchema.validate(values, {
        strict: true,
        stripUnknown: true,
      })
        .then(() => {
          firebase
            .createUser(values)
            .then(() => <Redirect to={{ pathname: '/' }} />)
            .catch(error => {
              toast.error(error);
              changeIsSubmitting(false);
            });
        })
        .catch(({ message }) => {
          if (message !== 'NO_MESSAGE') {
            toast.error(message);
          }
          changeIsSubmitting(false);
        });
    }
  };
  const handleKeyPress = ({ keyCode, charCode }, values) => {
    if (keyCode === 13 || charCode === 13) {
      submit(values);
    }
  };

  return (
    <Formik
      initialValues={{
        email: '',
        username: '',
        password: '',
        passwordConfirmation: '',
      }}
      onSubmit={submit}
      render={({ values, handleBlur, handleChange, handleSubmit }) => (
        <form autoCapitalize="off">
          <div className="form-container">
            <div className="text-field-container">
              <TextField
                autoFocus
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
                id="username"
                label="Username "
                className="text-field"
                value={values.username}
                helperText="This is will be used on the leaderboard"
                onChange={handleChange('username')}
                onBlur={handleBlur('username')}
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
              <TextField
                id="passwordConfirmation"
                type="password"
                label="Password Confirmation "
                className="text-field"
                margin="normal"
                variant="outlined"
                value={values.passwordConfirmation}
                onChange={handleChange('passwordConfirmation')}
                onBlur={handleBlur('passwordConfirmation')}
                onKeyDown={e => handleKeyPress(e, values)}
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
Signup.propTypes = {
  firebase: PropTypes.object,
};

export default withFirebase(Signup);
