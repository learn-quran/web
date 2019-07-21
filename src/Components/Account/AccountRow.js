import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  TextField,
  Button,
  Icon,
} from '@material-ui/core';

const AccountRow = ({
  isExpandable,
  field,
  fieldValue,
  onSubmit,
  textFieldType,
  buttonText,
  isSubmitting,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState(fieldValue);
  const handleChange = ({ target }) => setValue(target.value);
  const handleSubmit = () => onSubmit(value);
  const handleKeyPress = ({ keyCode, charCode }) => {
    if (keyCode === 13 || charCode === 13) {
      onSubmit(value);
    }
  };
  return (
    <ExpansionPanel
      disabled={!isExpandable}
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}>
      <ExpansionPanelSummary
        expandIcon={<Icon>arrow_drop_down</Icon>}
        aria-controls="panel1bh-content"
        id="panel1bh-header">
        <div className="field">{field}</div>
        <div className="field-value">{fieldValue}</div>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <div className="form">
          <div className="form-conatiner">
            <TextField
              className="text-field"
              margin="normal"
              variant="outlined"
              value={value}
              onChange={handleChange}
              label={field}
              type={textFieldType}
              onKeyDown={e => handleKeyPress(e)}
            />
            <Button
              variant="contained"
              color="primary"
              className="button"
              onClick={handleSubmit}
              disabled={isSubmitting}>
              {buttonText}
            </Button>
          </div>
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};
AccountRow.propTypes = {
  isExpandable: PropTypes.bool,
  field: PropTypes.string,
  fieldValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSubmit: PropTypes.func,
  textFieldType: PropTypes.string,
  buttonText: PropTypes.string,
  isSubmitting: PropTypes.bool,
};
AccountRow.defaultProps = {
  isExpandable: false,
  textFieldType: 'text',
};

export default AccountRow;
