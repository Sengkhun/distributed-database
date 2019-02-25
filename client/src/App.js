import React, { PureComponent, memo } from 'react';
import { withStyles } from '@material-ui/core/styles';

import { 
  CssBaseline,
  Button,
  Fade,
  FormControlLabel,
  Icon,
  LinearProgress,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@material-ui/core';
import NumberFormat from 'react-number-format';
import grey from '@material-ui/core/colors/grey';
import ErrorHelper from './components/ErrorHelper';

import { 
  queryOptimizationAPI,
  queryAPI 
} from './functions/query';

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
    width: 700,
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
  controlContainer: {
    display: 'flex',
    justifyContent: 'space-between',
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
    query: 'SELECT id, retailer, product_name, price FROM items LIMIT 5000',
    optimization: true,
    executedTime: 0,
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

  handleSwitchChange = event => {
    this.setState({ optimization: event.target.checked });
  };

  handleShowError = errorMessage => this.setState({ error: true, errorMessage });

  handleResetError = _ => this.setState({ error: false, errorMessage: '' });

  handleSubmitClick = e => {
    e.preventDefault();
    this.handleResetError();

    // if still loading, don't do anything
    if (this.state.loading) return;

    this.setState({ loading: true }, async _ => {
      if (this.state.optimization) {
        await this.queryOptimization();
      } else {
        await this.query();
      }
      this.setState({ loading: false });
    });
  };

  query = async () => {
    const { query } = this.state;
    const { status, data, message } = await queryAPI(query);
    if (status === 200) {
      const { results, executedTime } = data;
      const firstData = results && results[0];
      const header = firstData && Object.keys(firstData);
      const count = results.length;
      this.setState({ header, data: results, count, executedTime });
    } else {
      this.setState({
        data: [],
        executedTime: 0,
        error: true, 
        errorMessage: message
      });
    }
  };

  queryOptimization = async () => {
    const { query } = this.state;
    const { status, data, message } = await queryOptimizationAPI(query);
    if (status === 200) {
      const { results, executedTime } = data;
      const firstData = results && results[0];
      const header = firstData && Object.keys(firstData);
      const count = results.length;
      this.setState({ header, data: results, count, executedTime });
    } else {
      this.setState({
        data: [],
        executedTime: 0,
        error: true, 
        errorMessage: message
      });
    }
  };

  Header = () => {
    const { header } = this.state;
    const { classes } = this.props;
    return (
      <TableHead>
        <TableRow>
          { header && header.map((item, idx) => (
            <TableCell 
              key={idx} 
              padding='checkbox' 
              className={classes.tableHeadCell}
            >
              {item}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  Body = () => {
    const { header, data } = this.state;
    const { classes } = this.props;
    let count = 0;
    return data && data.map((item, idx) => {
      if (count++ > 200 || !item) return null;
      return (
        <TableRow hover key={idx}>
          { header && header.map((key, index) => (
              <TableCell 
                key={index} 
                padding='checkbox' 
                className={classes.tableCell}
              >
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
      optimization,
      executedTime,
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

              <div className={classes.controlContainer}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={optimization}
                      onChange={this.handleSwitchChange}
                      color="primary"
                    />
                  }
                  label="Optimization"
                />

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
                  {executedTime} ms
                </Typography>
              </div>

              <Paper className={classes.output}>
                <Table>
                  { header && <this.Header /> }

                  { header && data && 
                    <TableBody>
                      <this.Body />
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
