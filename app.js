import express from 'express';
import bodyParser from 'body-parser';

// get env variables
import 'dotenv/config';

const app = express();
const host = process.env.HOST;
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// start the server
app.listen(port, host, () => {
  return console.log(`🚀 Server is running on port ${port}`);
});
