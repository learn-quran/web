import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Icon,
} from '@material-ui/core';

const PasswordInputDialog = ({
  title,
  variant,
  headerText,
  label,
  textFieldType,
  initialValue,
  submitButtonText,
  onSubmit,
  isSubmitting,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
    setValue(initialValue || '');
  };
  const handleClose = () => setOpen(false);
  const handleChange = ({ target }) => setValue(target.value);
  const handleSubmit = () => {
    onSubmit(value, handleClose);
    setValue('');
  };
  const handleKeyPress = ({ keyCode, charCode }) => {
    if (keyCode === 13 || charCode === 13) {
      onSubmit(value, handleClose);
    }
  };

  return (
    <Fragment>
      <Button
        variant={variant || 'outlined'}
        color="primary"
        onClick={handleClickOpen}>
        {title}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          <div>{title}</div>
          <Icon className="icon" onClick={handleClose}>
            close
          </Icon>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{headerText}</DialogContentText>
          <TextField
            autoFocus
            fullWidth
            className="text-field"
            margin="normal"
            variant="outlined"
            label={label}
            type={textFieldType}
            value={value}
            onChange={handleChange}
            onKeyDown={e => handleKeyPress(e)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            className="submit-button"
            disabled={isSubmitting}>
            {submitButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
PasswordInputDialog.propTypes = {
  title: PropTypes.string,
  variant: PropTypes.string,
  headerText: PropTypes.string,
  label: PropTypes.string,
  initialValue: PropTypes.string,
  textFieldType: PropTypes.string,
  submitButtonText: PropTypes.string,
  onSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool,
};

export default PasswordInputDialog;
