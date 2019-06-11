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
    const { firebase, t } = this.props;
    firebase
      .getUser()
      .then(user => {
        this.setState({ user: { ...user } });
      })
      .catch(() => {
        toast.error(
          t('something-went-wrong-please-close-the-tab-and-try-again'),
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
    const { firebase, t } = this.props;
    if (username.length >= 3) {
      if (username !== this.state.user.username) {
        firebase
          .isUsernameDuplicated(username)
          .then(() => {
            this.setState({ isSubmitting: true });
            firebase
              .updateUserOnDB({ username })
              .then(() => toast.success(t('your-username-has-been-updated')))
              .catch(err => toast.error(t(err)))
              .finally(() => {
                this.setState({ isSubmitting: false });
                this.persistUserInfo();
              });
          })
          .catch(err => toast.error(t(err)));
      }
    } else toast.error(t('username-too-short'));
  };
  onEmailSubmit = email => {
    const { firebase, t } = this.props;
    if (
      // eslint-disable-next-line
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(email)
    ) {
      if (email !== this.state.user.email) {
        this.setState({ isSubmitting: true });
        firebase
          .updateUserEmail(email)
          .then(() => toast.success(t('your-email-has-been-updated')))
          .catch(err => toast.error(t(err)))
          .finally(() => {
            this.setState({ isSubmitting: false });
            this.persistUserInfo();
          });
      }
    } else toast.error('Invalid email');
  };
  onPasswordSubmit = (password, close) => {
    const { firebase, t } = this.props;
    if (password.length > 1) {
      if (password.length > 6) {
        this.setState({ isSubmitting: true });
        firebase
          .updateUserPassword(password)
          .then(() => {
            toast.success(t('password-updated-successfully'));
          })
          .catch(err => toast.error(t(err)))
          .finally(() => {
            this.setState({ isSubmitting: false });
            close();
            this.persistUserInfo();
          });
      } else toast.error(t('password-is-too-short'));
    }
  };
  onReauthSubmit = (password, close) => {
    const { firebase, t } = this.props;
    if (password.length > 1 && password.length > 6) {
      this.setState({ isSubmitting: true });
      firebase
        .reauthenticate(password)
        .then(() => {
          toast.success(t('account-reauthenticated-successfully'));
        })
        .catch(err => toast.error(t(err)))
        .finally(() => {
          this.setState({ isSubmitting: false });
          close();
        });
    }
  };

  render() {
    const { handleOpenClick, handleCloseClick, state, props } = this;
    // eslint-disable-next-line no-unused-vars
    const { t } = props;
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
                {t('edit-the-information-below-then-hit-save')}
              </DialogContentText>
              <AccountRow
                isExpandable
                field={t('username')}
                fieldValue={state.user.username}
                onSubmit={this.onUsernameSubmit}
                buttonText={t('change-username')}
                isSubmitting={state.isSubmitting}
              />
              <AccountRow
                isExpandable
                field={t('email')}
                fieldValue={state.user.email}
                onSubmit={this.onEmailSubmit}
                textFieldType="email"
                buttonText={t('change-email')}
                isSubmitting={state.isSubmitting}
              />
              <div className="buttons-container">
                <PasswordInputDialog
                  title={t('change-password')}
                  headerText={t(
                    'enter-your-new-password-below-you-need-to-be-recently-logged-in-to-change-your-password',
                  )}
                  label={t('password')}
                  submitButtonText={t('change')}
                  onSubmit={this.onPasswordSubmit}
                  isSubmitting={state.isSubmitting}
                />
                <PasswordInputDialog
                  title={t('re-authenticate-account')}
                  headerText={t(
                    'enter-your-password-below-to-re-authenticate-your-account',
                  )}
                  label={t('password')}
                  submitButtonText={t('re-authenticate')}
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
