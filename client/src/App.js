import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';

import { 
  CssBaseline,
  Button,
  Fade,
  Icon,
  LinearProgress,
  Paper,
  TextField,
  Typography
} from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';
import ErrorHelper from './components/ErrorHelper';

const styles = theme => ({
  root: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    textAlign: 'center',
    backgroundColor: theme.palette.primary.main,
    overflow: 'auto'
  },
  logo: {
    display: 'flex',
    height: '5rem',
    margin: `${theme.spacing.unit * 5}px auto`,
  },
  container: {
    display: 'block',
    width: 600,
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    },
    margin: '0 auto'
  },
  form: {
    display: 'flex',
    flexFlow: 'column',
    padding: theme.spacing.unit * 5,
    paddingBottom: theme.spacing.unit * 3,
    [theme.breakpoints.down('xs')]: {
      paddingLeft: theme.spacing.unit * 3,
      paddingRight: theme.spacing.unit * 3,
    },
  },
  title: {
    marginBottom: theme.spacing.unit * 4
  },
  inputContainer: {
    display: 'flex',
    flexFlow: 'row',
    alignItems: 'flex-end',
  },
  textField: {
    width: '100%'
  },
  btnSend: {
    marginLeft: theme.spacing.unit * 2,
    height: 56,
    marginBottom: 8,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  output: {
    minHeight: 300,
    maxHeight: 2000,
    marginTop: theme.spacing.unit,
    border: `1px solid ${grey[300]}`,
    borderRadius: 4,
  }
});

class App extends PureComponent {

  state = {
    query: '',
    loading: false,
    error: false,
    errorMessage: '',
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleShowError = errorMessage => this.setState({ error: true, errorMessage });

  handleResetError = _ => this.setState({ error: false, errorMessage: '' });

  handleSubmitClick = e => {
    e.preventDefault();
    this.handleResetError();

    // if still loading, don't do anything
    if (this.state.loading) return;

    this.setState({ loading: true }, _ => {
      // const isEmpty = this.handleEmptyInput();
      // if (!isEmpty) {
      //   const { phone_number, password } = this.state;
      //   this.login(phone_number, password);
      // }
    });
  };

  render() {

    const { 
      query,
      loading,
      error,
      errorMessage
    } = this.state;

    const { classes } = this.props;

    return (
      <Fade in>
        <div className={classes.root}>
          <CssBaseline />

          <img 
            className={classes.logo} 
            src='/images/paragon-no_bg.png'
            alt='Paragon logo'
          />

          <Paper className={classes.container} elevation={0}>

            { loading && <LinearProgress color='secondary'/> }

            <form className={classes.form}>

              <Typography variant='h4' className={classes.title}>
                Distributed Database
              </Typography>

              <div className={classes.inputContainer}>
                <TextField
                  required
                  autoFocus
                  label='Query'
                  className={classes.textField}
                  value={query}
                  onChange={this.handleChange}
                  name="query"
                  margin='normal'
                  variant='outlined'
                />

                <Button 
                  type='submit'
                  size="medium" 
                  color="primary" 
                  variant="contained"
                  className={classes.btnSend}
                  onClick={this.handleSubmitClick}
                >
                  Send
                  <Icon className={classes.rightIcon}>send</Icon>
                </Button>
              </div>

              <ErrorHelper 
                show={error}
                message={errorMessage}
              />
              <br/><br/>

              <Typography align='left' variant='subtitle1'>
                Output
              </Typography>

              <div className={classes.output}>

              </div>

            </form>
            <br/>

          </Paper>
        </div>
      </Fade>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
