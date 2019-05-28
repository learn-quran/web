import React from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Redirect } from 'react-router-dom';

import { withFirebase } from '../Firebase';

const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .required('Required')
    .email('Invalid email'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password too short'),
});

const Signup = ({ firebase }: Object) => {
  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      onSubmit={values => {
        SignupSchema.validate(values)
          .then(() => {
            firebase.auth
              .createUserWithEmailAndPassword(values.email, values.password)
              .then(() => <Redirect to={{ pathname: '/' }} />)
              .catch(function(error) {
                //console.log(error.message);
              });
          })
          .catch(err => {
            //console.log(err.message);
          });
      }}
      render={({
        values,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
          />
          <input
            type="password"
            name="password"
            onChange={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
          />
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </form>
      )}
    />
  );
};

export default withFirebase(Signup);
