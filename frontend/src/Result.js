import React from 'react';
import {useObserver} from 'mobx-react-lite';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

export default function Result({loading, error, result}) {
  const classes = useStyles();

  const isError = !!error;

  return useObserver(() => (
    <div className={classes.container}>
      {loading && <CircularProgress className={classes.progress} />}
      {!loading && isError && <Typography color="secondary" align="center">Terdapat Kesalahan</Typography>}
      {!loading && !isError && !!result && (
        <React.Fragment>
          <div className={classes.section}>
            {result.data.sentence.phrase.map((phrase, index) => (
              <React.Fragment key={`phrase#${index}`}>
                <Phrase phrase={phrase} />
                <span> </span>
              </React.Fragment>
            ))}
          </div>
          
          <div className={classes.section}>
            <Clusters clusters={result.result} phrases={result.data.sentence.phrase} />
          </div>

          <div className={classes.section}>
            <Typography>Keterangan:</Typography>
            <Typography color="primary">Non-singleton (Predicted)</Typography>
            <Typography color="secondary">Singleton (Predicted)</Typography>
          </div>

        </React.Fragment>
      )}
    </div>
  ));
}

function Clusters({clusters, phrases}) {
  const phraseById = phrases.reduce((ret, now) => {ret[Number(now['@id'])] = now; return ret;}, {});

  return (
    <div>
      <Typography>Markable Clusters:</Typography>

      {clusters.map((cluster, index) => (
        <div>
          <Typography component="span">{index+1}. </Typography>

          {cluster.map((phraseId, index) => (
            <React.Fragment>
              {index > 0 && (<Typography component="span"> - </Typography>)}
              <Phrase phrase={phraseById[phraseId]} />
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  )
}

function Phrase({phrase, component='span'}) {
  let color;
  if (!('@id' in phrase)) color = 'initial';
  else if (phrase['is_singleton']) color = 'secondary';
  else color = 'primary';
  
  return <Typography color={color} component={component}>{phrase['#text']}{'@id' in phrase && `[${phrase['@id']}]`}</Typography>;
}

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  progress: {
    alignSelf: 'center',
  },
  text: {
    display: 'flex',
    flexDirection: 'row'
  },
  section: {
    marginBottom: 30
  }
});