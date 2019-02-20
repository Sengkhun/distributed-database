import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { 
  Grow, 
  Icon, 
  Typography 
} from '@material-ui/core';

// ===================================

const propTypes = {
  show: PropTypes.bool.isRequired,
  message: PropTypes.string,
  icon: PropTypes.string,
};

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing.unit
  }
});

class ErrorHelper extends PureComponent {

  render() {

    const {
      classes,
      message,
      show = false,
      icon = 'error',
      ...rest
    } = this.props;

    return (
      <Fragment>
        {
          show ?
            // Grow is for animation only
            <Grow in>
              <Typography 
                align='left'
                color='error'
                variant='subtitle2'
                className={classes.root}
                {...rest} // use the rest of the props pass from used place
              >
                <Icon fontSize='small'>{icon}</Icon>&nbsp; 
                {message || 'Something Went Wrong' }
              </Typography>
            </Grow>
          : null
        }
      </Fragment>
    );
  }
}

ErrorHelper.propTypes = propTypes;

export default withStyles(styles, { withTheme: true })(ErrorHelper);