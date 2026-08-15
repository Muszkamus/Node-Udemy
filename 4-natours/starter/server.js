const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('Unhandled rejection, shutting down...');
  console.log(err);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: true,
  })
  .then(() => {
    // console.log(con.connections);
    console.log('Connected to the DB!');
  });

const port = process.env.PORT || 8001;
const server = app.listen(port, () => {
  console.log(`"App running on port ${port}...`);
});
// Safety net for unhandled promises
process.on('unhandledRejection', (err) => {
  console.log('Unhandled rejection, shutting down...');
  console.log(err.name, err.message);
  // console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
