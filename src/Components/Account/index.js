import React from 'react';
import { toast } from 'react-toastify';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Icon,
} from '@material-ui/core';

import PropTypes from 'prop-types';
import { withFirebase } from '../../Firebase';
import { withTranslation } from 'react-i18next';

import AccountRow from './AccountRow';
import PasswordInputDialog from './PasswordInputDialog';

import '../../Assets/stylesheets/Account.scss';

class Account extends React.Component {
  static propTypes = {
    firebase: PropTypes.object,
    t: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false,
      isModalOpen: false,
      user: false,
    };
  }

  componentDidMount() {
    this.persistUserInfo();
  }

  persistUserInfo = () => {
    this.props.firebase
      .getUser()
      .then(user => {
        this.setState({ user: { ...user } });
      })
      .catch(() => {
        toast.error(
          'Something went wrong. Please close the tab and try again.',
        );
      });
  };

  handleOpenClick = () => {
    this.setState({ isModalOpen: true });
  };
  handleCloseClick = () => {
    this.setState({ isModalOpen: false });
  };

  onUsernameSubmit = username => {
    if (username.length >= 3) {
      if (username !== this.state.user.username) {
        this.setState({ isSubmitting: true });
        this.props.firebase
          .updateUserOnDB({ username })
          .then(() => toast.success('Your username has been updated'))
          .catch(err => toast.error(this.props.t(err)))
          .finally(() => {
            this.setState({ isSubmitting: false });
            this.persistUserInfo();
          });
      }
    } else toast.error('Username too short');
  };
  onEmailSubmit = email => {
    if (
      // eslint-disable-next-line
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(email)
    ) {
      if (email !== this.state.user.email) {
        this.setState({ isSubmitting: true });
        this.props.firebase
          .updateUserEmail(email)
          .then(() => toast.success('Your email has been updated'))
          .catch(err => toast.error(this.props.t(err)))
          .finally(() => {
            this.setState({ isSubmitting: false });
            this.persistUserInfo();
          });
      }
    } else toast.error('Invalid email');
  };
  onPasswordSubmit = (password, close) => {
    if (password.length > 1) {
      if (password.length > 6) {
        this.setState({ isSubmitting: true });
        this.props.firebase
          .updateUserPassword(password)
          .then(() => {
            toast.success('Password updated successfully');
          })
          .catch(err => toast.error(this.props.t(err)))
          .finally(() => {
            this.setState({ isSubmitting: false });
            close();
            this.persistUserInfo();
          });
      } else toast.error('Password too short');
    }
  };
  onReauthSubmit = (password, close) => {
    if (password.length > 1 && password.length > 6) {
      this.setState({ isSubmitting: true });
      this.props.firebase
        .reauthenticate(password)
        .then(() => {
          toast.success('Account reauthenticated successfully');
        })
        .catch(err => toast.error(this.props.t(err)))
        .finally(() => {
          this.setState({ isSubmitting: false });
          close();
        });
    }
  };

  render() {
    const { handleOpenClick, handleCloseClick, state } = this;
    return (
      <div className="content">
        <div className="open-button" onClick={handleOpenClick}>
          Account
        </div>
        {!!state.user && (
          <Dialog
            maxWidth="lg"
            open={state.isModalOpen}
            onClose={handleCloseClick}
            aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">
              <div>Edit Account</div>
              <Icon className="icon" onClick={handleCloseClick}>
                close
              </Icon>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Edit the information below then hit save
              </DialogContentText>
              <AccountRow
                isExpandable
                field="Username "
                fieldValue={state.user.username}
                onSubmit={this.onUsernameSubmit}
                buttonText="Change Username"
                isSubmitting={state.isSubmitting}
              />
              <AccountRow
                isExpandable
                field="Email "
                fieldValue={state.user.email}
                onSubmit={this.onEmailSubmit}
                textFieldType="email"
                buttonText="Change Email"
                isSubmitting={state.isSubmitting}
              />
              <div className="buttons-container">
                <PasswordInputDialog
                  title="Change Password"
                  headerText={`Enter your new password below. You need to be recrently logged-in to
            change your password.`}
                  submitButtonText="Change"
                  onSubmit={this.onPasswordSubmit}
                  isSubmitting={state.isSubmitting}
                />
                <PasswordInputDialog
                  title="Re-authenticate Account"
                  headerText={`Enter your password below to re-authenticate your account.`}
                  submitButtonText="Re-authenticate"
                  onSubmit={this.onReauthSubmit}
                  isSubmitting={state.isSubmitting}
                />
              </div>
            </DialogContent>
            <DialogActions />
          </Dialog>
        )}
      </div>
    );
  }
}

export default withTranslation()(withFirebase(Account));
