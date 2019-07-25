import React, { useState } from 'react';

import PropTypes from 'prop-types';

import Login from './Login';
import Signup from './Signup';

import { logo } from '../Assets/Images';

import '../Assets/stylesheets/Landing.scss';
import { useTranslation } from 'react-i18next';

const Landing = () => {
  const [isLogin, showLogin] = useState(false);
  const [isSubmitting, changeIsSubmitting] = useState(false);
  const { t } = useTranslation();
  return (
    <div className="content">
      <div className="left side">
        <div className="logo-container">
          <img src={logo} alt="Learn Quran" className="logo" />
        </div>
        <div className={`text-container ${t('lang-code')}`}>
          <div className="header">
            Learn Quran is a hybrid platform for testing your knowledge in the
            Holy Quran!
          </div>
          <div className="sections">
            <div className="section">
              <div className="header">
                {`${t('how-to-play')} `}
                <span role="img" aria-label="play-emoji">
                  🎮
                </span>
              </div>
              The idea is that once you create an account you'll be redirected
              to a page where an audio is playing, the aduio is an Aya (verse)
              of randomly chosen Sura from the Holy Quran. There are four
              choices, only one of which is correct. The goal is to guess what
              Sura the verse playing is from. Have fun!{' '}
              <pre className="ascii">~(^-^)~</pre>
            </div>
            <div className="section">
              <div className="header">
                {`${t('inspiration')} `}
                <span role="img" aria-label="inspiration-emoji">
                  ✨
                </span>
              </div>
              This project was originally created for educational purposes.
              About two years ago I released my first Android app/game created
              with Unity, it was horrible, to say the least. Recreating the same
              app I made when I was first starting has really made me take
              another look at the process and effor I put in back then.
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
    </div>
  );
};
Login.propTypes = {
  firebase: PropTypes.object,
  history: PropTypes.object,
};

export default Landing;
