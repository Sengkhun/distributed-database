const errorHandler = error => {
  let status, message;

  switch (error) {
    case 'Network Error':
      status = 503;
      message = error;
      break;
    
    default:
      status = 503; // cannot connect to server
      message = 'server-maintenance'
      break;
  }

  return { status, message };

};

export default errorHandler;