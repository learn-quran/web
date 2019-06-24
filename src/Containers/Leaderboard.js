import React from 'react';
import PropTypes from 'prop-types';
import { ScaleLoader } from 'react-spinners';

import { withTranslation } from 'react-i18next';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { withFirebase } from '../Firebase';
import { objectToArray } from '../Helpers';

import '../Assets/stylesheets/Leaderboard.scss';

class Leaderboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      currentUser: {},
    };
  }
  componentDidMount() {
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
        {!!currentUser.uid && (
          <div className="your-points-container">
            <div className="your-points">{t('your-points')}</div>
            <div className="points">{currentUser.points}</div>
          </div>
        )}
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
                  <TableCell align="center">{item.lastPlayed}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}
Leaderboard.propTypes = {
  firebase: PropTypes.object,
  t: PropTypes.func,
};

export default withTranslation()(withFirebase(Leaderboard));
