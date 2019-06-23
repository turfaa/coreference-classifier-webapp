import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { useObserver } from "mobx-react-lite";
import React from "react";
import "typeface-roboto";
import corefStore from "./CorefStore";
import Form from "./Form";
import Result from "./Result";

export default function App() {
  const classes = useStyle();

  return useObserver(() => (
    <div className={classes.container}>
      <Typography variant="h3" align="center">
        Coreference Resolution for Indonesian Text
      </Typography>

      <div className={classes.content}>
        <div className={classes.flex1}>
          <Form onSubmit={value => corefStore.getMarkableClusters(value)} />
        </div>
        <div className={classes.flex1}>
          <Result
            error={corefStore.error}
            loading={corefStore.loading}
            result={corefStore.result}
          />
        </div>
      </div>
    </div>
  ));
}

const useStyle = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column"
  },
  content: {
    marginTop: 30,
    display: "flex",
    flexDirection: "row"
  },
  flex1: {
    flex: 1,
    margin: 10
  }
});
