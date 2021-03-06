import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import Login from '../Components/Login';
import Signup from '../Components/Signup';

import { logo } from '../Assets/Images';

import '../Assets/StyleSheets/Landing.scss';
import About from '../Components/About';

const Landing = () => {
  const [isLogin, showLogin] = useState(false);
  const [isSubmitting, changeIsSubmitting] = useState(false);
  const { t } = useTranslation();
  return (
    <div className={`landing-content ${t('lang-code')}-bg`}>
      <div className="left side">
        {!!navigator.userAgent.match(/android/i) && (
          <div className="android-container">
            <Button
              variant="contained"
              color="primary"
              className="button"
              onClick={() => {
                window.location.href =
                  'https://play.app.goo.gl/?link=https://play.google.com/store/apps/details?id=com.shbool.learnquran';
                // Fallback solution
                // window.open(
                //   'https://play.google.com/store/apps/details?id=com.shbool.learnquran',
                // );
              }}>
              {t('download-android-app')}
            </Button>
          </div>
        )}
        <div className="logo-container">
          <img src={logo} alt="Learn Quran" className="logo" />
        </div>
        <div className={`text-container ${t('lang-code')}`}>
          <div className="header">
            <span className="title">{`${t('learn-quran')} `}</span>
            {`${t(
              'is-a-hybrid-platform-for-testing-your-knowledge-in-the-holy-quran',
            )}!`}
          </div>
          <div className="sections">
            <div className="section">
              <div className="header">
                {`${t('how-to-play')} `}
                <span role="img" aria-label="play-emoji">
                  🎮
                </span>
              </div>
              {`${t('landing-page-how-to-play-paragprah')} `}
              <span className="ascii">~(^-^)~</span>
            </div>
            <div className="section">
              <div className="header">
                {`${t('inspiration')} `}
                <span role="img" aria-label="inspiration-emoji">
                  ✨
                </span>
              </div>
              {t('landing-page-inspiration-paragprah')}
            </div>
          </div>
        </div>
      </div>
      <div className="right side">
        {isLogin ? (
          <Login
            changeIsSubmitting={changeIsSubmitting}
            isSubmitting={isSubmitting}
            showLogin={showLogin}
          />
        ) : (
          <Signup
            changeIsSubmitting={changeIsSubmitting}
            isSubmitting={isSubmitting}
            showLogin={showLogin}
          />
        )}
      </div>
      <About />
    </div>
  );
};
Login.propTypes = {
  firebase: PropTypes.object,
  history: PropTypes.object,
};

export default Landing;
