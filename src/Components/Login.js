import React from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TextField, Button } from '@material-ui/core';

import PropTypes from 'prop-types';
import { withFirebase } from '../Firebase';

import InputDialog from '../Components/InputDialog';

const LoginSchema = Yup.object().shape({
  password: Yup.string().required('password-is-required'),
  email: Yup.string()
    .email('NO_MESSAGE')
    .required('email-is-required'),
});

const Login = ({
  firebase,
  history,
  isSubmitting,
  changeIsSubmitting,
  showLogin,
}) => {
  const { t, i18n } = useTranslation();
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

  const onResetPasswordSubmit = (email, close) => {
    if (
      // eslint-disable-next-line
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(email)
    ) {
      firebase
        .resetPassword(email, i18n.language)
        .then(() => {
          toast.success(t('email-sent'));
          close();
        })
        .catch(({ message }) => toast.error(t(message)));
    } else toast.error(t('invalid-email'));
  };

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      onSubmit={submit}
      render={({ values, handleBlur, handleChange, handleSubmit }) => (
        <form onSubmit={handleSubmit} autoCapitalize="off">
          <div className="form-container login">
            <div className="text-field-container">
              <TextField
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
                  onClick={() => showLogin(false)}>
                  {t('dont-have-an-account')}
                </Button>
                <InputDialog
                  title={t('forgot-your-password')}
                  variant="text"
                  headerText={t(
                    'enter-your-email-below-to-send-instructions-to-reset-your-password',
                  )}
                  initialValue={values.email}
                  label={t('email')}
                  submitButtonText={t('send')}
                  textFieldType="email"
                  onSubmit={onResetPasswordSubmit}
                  isSubmitting={isSubmitting}
                />
              </div>
            </div>
          </div>
        </form>
      )}
    />
  );
};
Login.propTypes = {
  firebase: PropTypes.object,
  history: PropTypes.object,
  isSubmitting: PropTypes.bool,
  changeIsSubmitting: PropTypes.func,
  showLogin: PropTypes.func,
};

export default withRouter(withFirebase(Login));
