import express from 'express';
import bodyParser from 'body-parser';

// get env variables
import 'dotenv/config';
import routes from './routes';

const app = express();
const host = process.env.HOST;
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes);

// start the server
app.listen(port, host, () => {
  return console.log(`🚀 Server is running on port ${port}`);
});
