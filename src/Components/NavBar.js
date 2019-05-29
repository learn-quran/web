import React from 'react';
import PropTypes from 'prop-types';

import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';

import { withTranslation } from 'react-i18next';

import { SignedInNavBar, SignedOutNavBar } from '../Navigation';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: null,
    };
  }
  handleChange = language => {
    this.props.i18n.changeLanguage(language);
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.body.classList.add(language === 'en' ? 'ltr' : 'rtl');
    document.body.classList.remove(language === 'en' ? 'rtl' : 'ltr');
    document.body.setAttribute('dir', language === 'en' ? 'ltr' : 'rtl');
    this.handleClose();
  };
  handleClick = e => {
    this.setState({
      menu: e.currentTarget,
    });
  };
  handleClose = () => {
    this.setState({
      menu: null,
    });
  };
  render() {
    const { handleChange, handleClose, handleClick, state, props } = this;
    const { menu } = state;
    const { t, user } = props;
    return (
      <div className="nav">
        {user ? <SignedInNavBar /> : <SignedOutNavBar />}
        <div className="language-switch">
          <Button
            aria-owns={menu ? 'simple-menu' : undefined}
            aria-haspopup="true"
            onClick={handleClick}>
            {t('language')}
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={menu}
            open={Boolean(menu)}
            onClose={handleClose}>
            <MenuItem onClick={() => handleChange('en')}>ENGLISH</MenuItem>
            <MenuItem onClick={() => handleChange('ar')}>ARABIC</MenuItem>
          </Menu>
        </div>
      </div>
    );
  }
}
NavBar.propTypes = {
  user: PropTypes.object,
  t: PropTypes.func,
  i18n: PropTypes.object,
};

export default withTranslation()(NavBar);
