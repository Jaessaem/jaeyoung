const mongoose = require('mongoose');

const host = process.env.DB_HOST || '127.0.0.1'
// const dbURL = `mongodb://${host}/Loc8r`;
const dbURL = 'mongodb+srv://user1:12341234@cluster0.sjaf4ap.mongodb.net/Loc8r';

const readLine = require('readline');
mongoose.set("strictQuery", false);

const connect = () => {
  setTimeout(() => mongoose.connect(dbURL, { useNewUrlParser: true }), 1000);
}

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to ' + dbURL);
});

mongoose.connection.on('error', err => {
  console.log('error: ' + err);
  return connect();
});

mongoose.connection.on('disconnected', () => {
  console.log('disconnected to ' + dbURL);
});

if (process.platform === 'win32') {
  const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.on ('SIGINT', () => {
    process.emit("SIGINT");
  });
}

const gracefulShutdown = (msg, callback) => {
  mongoose.connection.close( () => {
    console.log(`Mongoose disconnected through ${msg}`);
    callback();
  });
};

process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});
process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
});
process.on('SIGTERM', () => {
  gracefulShutdown('Heroku app shutdown', () => {
    process.exit(0);
  });
});

connect();

require('./locations');
require('./users');