import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

import { Fab, Tooltip, Menu, MenuItem } from '@material-ui/core';
import {
  Menu as MenuIcon,
  Language,
  InsertChartOutlined,
} from '@material-ui/icons';

import PropTypes from 'prop-types';
import { withFirebase } from '../Firebase';
import { useTranslation } from 'react-i18next';

const FAB = ({ firebase, history }) => {
  const [isOpen, changeIsOpen] = useState(false);
  const [menu, setMenu] = useState(null);
  const { t, i18n } = useTranslation();
  const handleClick = e => setMenu(e.currentTarget);
  const handleClose = () => setMenu(null);
  const handleLanguageChange = language => {
    if ((localStorage.getItem('language') || 'en') !== language) {
      i18n.changeLanguage(language).then(() => {
        localStorage.setItem('language', language);
        handleClose();
        if (firebase.isLoggedIn) {
          firebase
            .updateUserOnDB({ language })
            .then(() => {
              window.location.reload();
            })
            .catch(() => {});
        } else {
          window.location.reload();
        }
      });
    }
  };
  return (
    <div className="fab">
      <Tooltip title={t('menu')} placement="top">
        <Fab
          size="small"
          className="main-fab"
          aria-label={t('menu')}
          onClick={() => changeIsOpen(!isOpen)}>
          <MenuIcon />
        </Fab>
      </Tooltip>
      <div className={`fab-wheel ${isOpen && 'open'}`}>
        <React.Fragment>
          <Tooltip title={t('language')} placement="top">
            <Fab
              size="medium"
              className="fab-action fab-action-1"
              aria-label={t('language')}
              onClick={handleClick}>
              <Language />
            </Fab>
          </Tooltip>
          <Menu
            id="simple-menu"
            anchorEl={menu}
            open={Boolean(menu)}
            onClose={handleClose}>
            <MenuItem onClick={() => handleLanguageChange('en')}>
              {t('english')}
            </MenuItem>
            <MenuItem onClick={() => handleLanguageChange('ar')}>
              {t('arabic')}
            </MenuItem>
          </Menu>
        </React.Fragment>
        <Tooltip title={t('leaderboard')} placement="top">
          <Fab
            size="medium"
            className="fab-action fab-action-2"
            aria-label={t('leaderboard')}
            onClick={() => history.push('/leaderboard')}>
            <InsertChartOutlined />
          </Fab>
        </Tooltip>
      </div>
    </div>
  );
};
FAB.propTypes = {
  firebase: PropTypes.object,
  history: PropTypes.object,
};

export default withRouter(withFirebase(FAB));
