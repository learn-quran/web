import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import { TextField, Button } from '@material-ui/core';

import PropTypes from 'prop-types';
import { withFirebase } from '../Firebase';

import { useTranslation } from 'react-i18next';

import '../Assets/stylesheets/Signup.scss';

const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .required('email-is-required')
    .email('invalid-email'),
  username: Yup.string()
    .required('username-is-required')
    .min(3, 'username-too-short')
    .matches(
      /^(?:[\u0600-\u065f]+|[a-z]+)$/i,
      'username-can-only-contain-letters',
    ),
  password: Yup.string()
    .required('password-is-required')
    .min(6, 'password-is-too-short'),
  passwordConfirmation: Yup.string().required(
    'password-confirmation-is-required',
  ),
});

const Signup = ({ firebase }) => {
  const [isSubmitting, changeIsSubmitting] = useState(false);
  const { t } = useTranslation();
  const submit = values => {
    if (values.password !== values.passwordConfirmation) {
      toast.error(t('passwords-dont-match'));
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
              toast.error(t(error));
              changeIsSubmitting(false);
            });
        })
        .catch(({ message }) => {
          if (message !== 'NO_MESSAGE') {
            toast.error(t(message));
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
        <div className="signup-content">
          <form autoCapitalize="off">
            <div className="form-container">
              <div className="text-field-container">
                <TextField
                  autoFocus
                  id="email"
                  label={t('email')}
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
                  label={t('username')}
                  className="text-field"
                  value={values.username}
                  helperText={t('this-will-be-used-on-the-leaderboard')}
                  onChange={handleChange('username')}
                  onBlur={handleBlur('username')}
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  id="password"
                  type="password"
                  label={t('password')}
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
                  label={t('password-confirmation')}
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
                  {t('sign-up')}
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
    />
  );
};
Signup.propTypes = {
  firebase: PropTypes.object,
};

export default withFirebase(Signup);
