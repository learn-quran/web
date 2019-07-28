import React from 'react';
import * as moment from 'moment';
import PropTypes from 'prop-types';
import ReactAudioPlayer from 'react-audio-player';
import { toast } from 'react-toastify';
import { Button, Grid, Slider, IconButton } from '@material-ui/core';
import { VolumeDown, VolumeUp, Refresh } from '@material-ui/icons';

import {
  getRandomDatom,
  getRandomAsset,
  getFourRandomDatoms,
} from '../Assets/Audio';
import { onWin, onLose } from '../Assets/Animations';

import '../Assets/stylesheets/Player.scss';
import { withTranslation } from 'react-i18next';
import { withFirebase } from '../Firebase';
import AfterPlay from '../Components/AfterPlay';

class Player extends React.Component {
  static propTypes = {
    firebase: PropTypes.object,
    t: PropTypes.func,
  };

  constructor() {
    super();
    this.state = {
      url: '',
      volume: 0.5,
      won: false,
      lost: false,
      user: {},
    };
    this.initalize();
  }

  componentDidMount() {
    this.getAsset();
    this.persistUserInfo();
  }

  getAsset = () => {
    this.props.firebase
      .getAsset(getRandomAsset(this.datom))
      .then(url => this.setState({ url }))
      .catch(() => {
        toast.error(
          this.props.t(
            'something-went-wrong-please-close-the-tab-and-try-again',
          ),
        );
      });
  };
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
  initalize = (reset = false) => {
    if (reset) {
      this.setState({
        url: '',
        won: false,
        lost: false,
      });
      this.getAsset();
    }
    this.datom = getRandomDatom();
    this.datoms = getFourRandomDatoms(this.datom);
    this.points = 3;
  };

  handleResetClick = () => {
    const el = this.audioComponent.audioEl;
    el.pause();
    el.currentTime = 0;
    el.play();
  };
  handleVolumeChange = (_, volume) => this.setState({ volume });
  handleAnswerClick = index => {
    const { t, firebase } = this.props;
    if (this.datoms[index].index === this.datom.index) {
      this.setState({
        won: true,
      });
      firebase
        .updateUserPoints(this.points)
        .then(() => {
          toast.success(
            t('congratulations-you-earned-n-points', { points: this.points }),
          );
          this.persistUserInfo();
        })
        .catch(() => {
          toast.error(
            t(
              'there-was-an-error-adding-your-points-please-contact-us-to-fix-it',
            ),
          );
        });
    } else {
      toast.warn(t('try-again'));
      this.datoms[index].disabled = true;
      this.points -= 1;
      if (this.points === 0) {
        this.setState({ lost: true });
      } else {
        this.forceUpdate();
      }
    }
    firebase.updateUserLastPlayed(
      moment()
        .locale('en')
        .format(),
    );
  };

  render() {
    const { volume, url, lost, won, user } = this.state;
    const { t } = this.props;
    return (
      <div className="player-content">
        {!!user.uid && (
          <div className="your-points-container">
            <div className="your-points">{t('your-points')}</div>
            <div className="points">{user.points}</div>
          </div>
        )}
        {lost ? (
          <AfterPlay
            animationData={onLose}
            init={this.initalize}
            buttonText={t('play-again')}
          />
        ) : won ? (
          <AfterPlay
            animationData={onWin}
            init={this.initalize}
            buttonText={t('play-again')}
          />
        ) : (
          <React.Fragment>
            <IconButton
              className="reset-button"
              aria-label={t('reset')}
              onClick={this.handleResetClick}>
              <Refresh />
            </IconButton>
            <Grid container spacing={2} className="slider-container">
              <Grid item>
                <VolumeDown />
              </Grid>
              <Grid item xs>
                <Slider
                  value={volume}
                  onChange={this.handleVolumeChange}
                  aria-labelledby={t('change-volume')}
                  min={0}
                  max={1}
                  step={0.05}
                />
              </Grid>
              <Grid item>
                <VolumeUp />
              </Grid>
            </Grid>
            <div className="buttons-container">
              <div className="buttons-row">
                <Button
                  variant="outlined"
                  color="primary"
                  className="button"
                  disabled={this.datoms[0].disabled}
                  onClick={() => this.handleAnswerClick(0)}>
                  {this.datoms[0].name[t('lang-code')]}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  className="button"
                  disabled={this.datoms[1].disabled}
                  onClick={() => this.handleAnswerClick(1)}>
                  {this.datoms[1].name[t('lang-code')]}
                </Button>
              </div>
              <div className="buttons-row">
                <Button
                  variant="outlined"
                  color="primary"
                  className="button"
                  disabled={this.datoms[2].disabled}
                  onClick={() => this.handleAnswerClick(2)}>
                  {this.datoms[2].name[t('lang-code')]}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  className="button"
                  disabled={this.datoms[3].disabled}
                  onClick={() => this.handleAnswerClick(3)}>
                  {this.datoms[3].name[t('lang-code')]}
                </Button>
              </div>
            </div>
          </React.Fragment>
        )}
        <ReactAudioPlayer
          autoPlay
          volume={volume}
          src={url}
          ref={o => (this.audioComponent = o)}
        />
      </div>
    );
  }
}

export default withTranslation()(withFirebase(Player));
