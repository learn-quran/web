import React from 'react';
import Lottie from 'react-lottie';
import PropTypes from 'prop-types';

import {
  noConnection as noConnectionAnimation,
  connecting,
} from '../Assets/Animations';

const MonitorConnection = ({ noConnection, loading, children }) => {
  return noConnection ? (
    <div className="animation-container">
      <div className="animation">
        <Lottie
          options={{
            autoplay: true,
            loop: false,
            animationData: noConnectionAnimation,
          }}
        />
      </div>
    </div>
  ) : loading ? (
    <div className="animation-container">
      <div className="animation">
        <Lottie
          options={{
            autoplay: true,
            loop: true,
            animationData: connecting,
          }}
        />
      </div>
    </div>
  ) : (
    children
  );
};
MonitorConnection.propTypes = {
  noConnection: PropTypes.bool,
  loading: PropTypes.bool,
  children: PropTypes.node,
};

export default MonitorConnection;
