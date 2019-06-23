import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import {DEFAULT_TEXT} from './constants';

export default function  Form({onSubmit}) {
  const [value, changeValue] = useState(DEFAULT_TEXT);
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <TextField
        label="Text"
        multiline
        rows="10"
        value={value}
        onChange={event => changeValue(event.target.value)}
        className={classes.textField}
        margin="normal"
        fullWidth
        autoFocus
      />
      
      <Button variant="contained" className={classes.button} onClick={() => onSubmit(value)}>
        Get Markable Clusters
      </Button>
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
}));