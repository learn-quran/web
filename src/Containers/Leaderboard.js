import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Fab,
} from '@material-ui/core';
import { Home } from '@material-ui/icons';

import * as moment from 'moment';
import 'moment/locale/ar';

import { withTranslation } from 'react-i18next';
import { withFirebase } from '../Firebase';
import { objectToArray } from '../Helpers';

import '../Assets/StyleSheets/Leaderboard.scss';

class Leaderboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      currentUser: {},
    };
  }
  componentDidMount() {
    document.title = this.props.t('leaderboard');
    this._mounted = true;
    const { firebase } = this.props;
    firebase
      .getLeaderboard()
      .then(
        users =>
          this._mounted && this.setState({ users: objectToArray(users) }),
      );
    firebase
      .getUser()
      .then(currentUser => this._mounted && this.setState({ currentUser }))
      .catch(() => {});
  }
  componentWillUnmount() {
    this._mounted = false;
  }
  render() {
    const { users, currentUser } = this.state;
    const { t } = this.props;
    return users.length === 0 ? (
      <ScaleLoader sizeUnit={'px'} size={150} color={'#123abc'} loading />
    ) : (
      <div className="leaderboard-content">
        <div className="table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">{t('username')}</TableCell>
                <TableCell align="center">{t('points')}</TableCell>
                <TableCell align="center">{t('latest-try')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((item, index) => (
                <TableRow
                  key={index}
                  className={
                    item.uid === currentUser.uid ? 'current-user-row' : ''
                  }>
                  <TableCell align="center" component="th" scope="row">
                    {item.username}
                  </TableCell>
                  <TableCell align="center">{item.points}</TableCell>
                  <TableCell align="center">
                    {item.lastPlayed === 'never-played'
                      ? t(item.lastPlayed)
                      : moment(item.lastPlayed).fromNow()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Tooltip title={t('resume-playing')} placement="top">
          <Fab
            size="small"
            className="home-fab"
            aria-label={t('home')}
            onClick={() => this.props.history.push('/')}>
            <Home />
          </Fab>
        </Tooltip>
      </div>
    );
  }
}
Leaderboard.propTypes = {
  firebase: PropTypes.object,
  t: PropTypes.func,
  history: PropTypes.object,
};

export default withRouter(withTranslation()(withFirebase(Leaderboard)));
