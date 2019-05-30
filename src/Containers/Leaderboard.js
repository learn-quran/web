import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ScaleLoader } from 'react-spinners';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { withFirebase } from '../Firebase';
import { objectToArray } from '../Helpers';

import '../Assets/stylesheets/Leaderboard.scss';

const Leaderboard = ({ firebase }) => {
  const [users, setUsers] = useState([]);
  if (users.length === 0) {
    firebase.getLeaderboard().then(users => setUsers(objectToArray(users)));
  }
  return users.length === 0 ? (
    <ScaleLoader sizeUnit={'px'} size={150} color={'#123abc'} loading />
  ) : (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align="center">Username</TableCell>
          <TableCell align="center">Points</TableCell>
          <TableCell align="center">Latest Try</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((item, index) => (
          <TableRow key={index}>
            <TableCell align="center" component="th" scope="row">
              {item.username}
            </TableCell>
            <TableCell align="center">{item.points}</TableCell>
            <TableCell align="center">{item.lastPlayed}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
Leaderboard.propTypes = {
  firebase: PropTypes.object,
};

export default withFirebase(Leaderboard);
