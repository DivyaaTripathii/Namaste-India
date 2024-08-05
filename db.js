const mysql = require('mysql2');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ],
});

const db = mysql.createConnection({
  host: 'localhost',   // Your database host
  user: 'root',        // Your database user
  password: 'divyaatripathii',// Your database password
  database: 'NamasteIndia' // Your database name
});

db.connect((err) => {
  if (err) {
    logger.error('Error connecting to the database:', err);
    process.exit(1); // Exit the application if the database connection fails
  } else {
    logger.info('Connected to the database');
  }
});

module.exports = db;