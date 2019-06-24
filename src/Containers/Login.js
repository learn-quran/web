import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { TextField, Button } from '@material-ui/core';

import PropTypes from 'prop-types';
import { withFirebase } from '../Firebase';

import { useTranslation } from 'react-i18next';
import '../Assets/stylesheets/Signup.scss';

const LoginSchema = Yup.object().shape({
  password: Yup.string().required('password-is-required'),
  email: Yup.string()
    .email('NO_MESSAGE')
    .required('email-is-required'),
});

const Login = ({ firebase, history }) => {
  const [isSubmitting, changeIsSubmitting] = useState(false);
  const { t } = useTranslation();
  const submit = values => {
    changeIsSubmitting(true);
    LoginSchema.validate(values, {
      strict: true,
      stripUnknown: true,
    })
      .then(() => {
        firebase
          .signIn(values)
          .then(() => history.push('/'))
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
        password: '',
      }}
      onSubmit={submit}
      render={({ values, handleBlur, handleChange, handleSubmit }) => (
        <div className="signup-content">
          <form onSubmit={handleSubmit} autoCapitalize="off">
            <div className="form-container login">
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
                  id="password"
                  type="password"
                  label={t('password')}
                  className="text-field"
                  value={values.password}
                  onChange={handleChange('password')}
                  onBlur={handleBlur('password')}
                  margin="normal"
                  variant="outlined"
                  onKeyDown={e => handleKeyPress(e, values)}
                />
              </div>
              <div className="buttons-container">
                <Button
                  variant="contained"
                  color="primary"
                  className="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}>
                  {t('log-in')}
                </Button>
                <div className="inner-buttons-container">
                  <Button
                    variant="text"
                    color="primary"
                    className="button"
                    onClick={() => history.push('/signup')}>
                    {t('dont-have-an-account')}
                  </Button>
                  <Button
                    variant="text"
                    color="primary"
                    className="button"
                    onClick={() => {}}>
                    {t('forgot-your-password')}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    />
  );
};
Login.propTypes = {
  firebase: PropTypes.object,
  history: PropTypes.object,
};

export default withRouter(withFirebase(Login));
