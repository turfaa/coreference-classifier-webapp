import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import React, { useState } from "react";
import { DEFAULT_TEXT } from "./constants";

export default function Form({ onSubmit }) {
  const [value, changeValue] = useState(DEFAULT_TEXT);
  const [useSingletonClassifier, changeUseSingletonClassifier] = useState(true);
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

      <FormControlLabel
        control={
          <Checkbox
            checked={useSingletonClassifier}
            onChange={event =>
              changeUseSingletonClassifier(event.target.checked)
            }
            color="primary"
          />
        }
        label="Use Singleton Classifier"
      />

      <Button
        variant="contained"
        className={classes.button}
        onClick={() => onSubmit(value, useSingletonClassifier)}
      >
        Get Markable Clusters
      </Button>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexDirection: "column"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(1)
  }
}));
