import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { withFirebase } from '../Firebase';

const SignupSchema = Yup.object().shape({
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password too short'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email'),
});
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    flex: 1,
    height: '70vh',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    width: theme.spacing(50),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  button: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    margin: theme.spacing(1),
  },
}));

const Signup = ({ firebase }: Object) => {
  const styles = useStyles();
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
              .catch(function(error) {
                toast.error(error.message);
                changeIsSubmitting(false);
              });
          })
          .catch(err => {
            toast.error(err.message);
            changeIsSubmitting(false);
          });
      }}
      render={({ values, handleBlur, handleChange, handleSubmit }) => (
        <Grid
          container
          className={styles.root}
          justify="center"
          alignItems="center">
          <form
            className={styles.container}
            onSubmit={handleSubmit}
            autoCapitalize="off"
            autoComplete="off">
            <TextField
              id="email"
              label="Email "
              type="email"
              className={styles.textField}
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
              className={styles.textField}
              value={values.password}
              onChange={handleChange('password')}
              onBlur={handleBlur('password')}
              margin="normal"
              variant="outlined"
            />
            <Button
              variant="contained"
              color="primary"
              className={styles.button}
              onClick={handleSubmit}
              disabled={isSubmitting}>
              Sign up
            </Button>
          </form>
        </Grid>
      )}
    />
  );
};

export default withFirebase(Signup);
