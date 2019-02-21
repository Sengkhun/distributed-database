import React, { PureComponent, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';

import { 
  CssBaseline,
  Button,
  Fade,
  Icon,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@material-ui/core';
import Timer from 'react-compound-timer';
import NumberFormat from 'react-number-format';
import grey from '@material-ui/core/colors/grey';
import ErrorHelper from './components/ErrorHelper';

import { queryAPI } from './functions/query';

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
    margin: '0 auto',
    marginBottom: theme.spacing.unit * 5
  },
  form: {
    display: 'flex',
    flexFlow: 'column',
    padding: theme.spacing.unit * 5,
    paddingBottom: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit,
    [theme.breakpoints.down('xs')]: {
      paddingLeft: theme.spacing.unit * 3,
      paddingRight: theme.spacing.unit * 3,
    },
  },
  title: {
    marginBottom: theme.spacing.unit * 4
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  textField: {
    width: '100%'
  },
  btnSend: {
    height: 56,
    marginBottom: 8,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  outputHeader: {
    display: 'flex',
    flexFlow: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.unit * 2
  },
  output: {
    minHeight: 300,
    marginBottom: theme.spacing.unit * 2,
    border: `1px solid ${grey[300]}`,
    borderRadius: 4,
  },
  tableHeadCell: {
    textTransform: 'capitalize'
  },
  tableCell: {
    cursor: 'pointer'
  }
});

class App extends PureComponent {

  state = {
    query: 'SELECT id, product_name, price, retailer FROM items LIMIT 3',
    loading: false,
    count: 0,
    header: null,
    data: null,
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

    this.setState({ loading: true }, async _ => {
      this.resetTimer();
      this.startTimer();
      await this.query();
      this.stopTimer();
      this.setState({ loading: false });
    });
  };

  query = async () => {
    const { query } = this.state;
    const { status, data, message } = await queryAPI(query);
    if (status === 200) {
      const firstData = data && data[0];
      const header = Object.keys(firstData);
      const count = data.length;
      this.setState({ header, data, count });
    } else {
      this.handleShowError(message);
    }
  };

  renderHeader = () => {
    const { header } = this.state;
    const { classes } = this.props;
    return header && header.map((item, idx) => (
      <TableCell key={idx} className={classes.tableHeadCell}>
        {item}
      </TableCell>
    ));
  };

  renderBody = () => {
    const { header, data } = this.state;
    const { classes } = this.props;
    let count = 0;
    return data && data.map((item, idx) => {
      if (count++ > 200 || !item) return null;
      return (
        <TableRow hover key={idx}>
          { 
            header && header.map((key, index) => (
              <TableCell key={index} className={classes.tableCell}>
                {item[key]}
              </TableCell>
            ))
          }
        </TableRow>
      );
    });
  };

  render() {

    const { 
      query,
      loading,
      count,
      header,
      data,
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

              <TextField
                required
                autoFocus
                multiline
                label='Query'
                name="query"
                margin='normal'
                variant='outlined'
                rows={4}
                rowsMax={6}
                disabled={loading}
                className={classes.textField}
                value={query}
                onChange={this.handleChange}
              />

              <div className={classes.btnContainer}>              
                <Button 
                  type='submit'
                  size="small" 
                  color="primary" 
                  variant="contained"
                  disabled={loading}
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

              <div className={classes.outputHeader}>
                <Typography variant='subtitle2'>
                  Output: &nbsp;
                  <NumberFormat 
                    value={count} displayType={'text'} 
                    thousandSeparator={true}
                  />
                </Typography>
                
                <Typography variant='subtitle2'>
                  Time: &nbsp;
                  <Timer startImmediately={false}>
                    {({ start, stop, reset }) => {
                      this.startTimer = start;
                      this.stopTimer = stop;
                      this.resetTimer = reset;
                      return (
                        <Fragment>
                          <Timer.Seconds />s
                        </Fragment>
                      );
                    }}
                  </Timer>
                </Typography> 
              </div>

              <Paper className={classes.output}>
                <Table>
                  { header && 
                    <TableHead>
                      <TableRow>
                        { this.renderHeader() }
                      </TableRow>
                    </TableHead> }

                  { header && data && 
                    <TableBody>
                      { this.renderBody() }
                    </TableBody> }
                </Table>
              </Paper>

            </form>
          </Paper>
        </div>
      </Fade>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
