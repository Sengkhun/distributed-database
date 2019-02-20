import express from 'express';
import bodyParser from 'body-parser';
// import timeout from 'connect-timeout';

// get env variables
import 'dotenv/config';
import routes from './server/routes';
import errorHandler from './server/errorHandler';

const app = express();
const host = process.env.HOST;
const port = process.env.PORT;

// app.use(timeout('15s'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);

// error handler
app.use(errorHandler);

// start the server
app.listen(port, host, () => {
  return console.log(`🚀 Server is running on port ${port}`);
});
