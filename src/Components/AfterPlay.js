import React from 'react';
import PropTypes from 'prop-types';
import Lottie from 'react-lottie';
import { Button } from '@material-ui/core';

const AfterPlay = ({ animationData, init, buttonText }) => {
  const defaultOptions = {
    autoplay: true,
    loop: false,
  };
  return (
    <div className="after-play">
      <div className="on-animation-container">
        <Lottie
          options={{
            ...defaultOptions,
            animationData,
          }}
        />
      </div>
      <Button
        variant="contained"
        color="primary"
        className="button"
        onClick={() => init(true)}>
        {buttonText}
      </Button>
    </div>
  );
};
AfterPlay.propTypes = {
  animationData: PropTypes.object,
  init: PropTypes.func,
  buttonText: PropTypes.string,
};

export default AfterPlay;
