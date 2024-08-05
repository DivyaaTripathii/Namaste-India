const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const logger = require('C:/Users/EMAIL/NamasteIndia/logger.js'); // Import the logger module
const db = require('C:/Users/EMAIL/NamasteIndia/db.js'); // Import the database connection module

const app = express();
app.use(express.json());

// Custom middleware function for logging
const loggerMiddleware = (req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
};

app.use(loggerMiddleware);

// Example endpoint to handle POST requests to /login
app.post('/login', (req, res) => {
  logger.info(`Incoming POST request to /login: ${JSON.stringify(req.body)}`);
  
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const query = 'SELECT * FROM CreateAccountDetails WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      logger.error('Database query error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.pass);

    if (isMatch) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

// Endpoint to handle account creation
app.post('/createaccount', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Check if the email already exists
    const checkQuery = 'SELECT * FROM CreateAccountDetails WHERE email = ?';
    db.query(checkQuery, [email], async (err, results) => {
      if (err) {
        logger.error('Database query error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      console.log('Check results:', results); // Debugging line

      if (results.length > 0) {
        console.log('Account already exists'); // Debugging line
        return res.status(409).json({ error: 'Account already exists' });
      }

      // If email does not exist, proceed with account creation
      const hashedPassword = await bcrypt.hash(password, 10);
      const insertQuery = 'INSERT INTO CreateAccountDetails (email, pass) VALUES (?, ?)';
      db.query(insertQuery, [email, hashedPassword], (err, result) => {
        if (err) {
          logger.error('Error creating account:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        logger.info(`Account created for ${email}`);
        res.status(201).json({ message: 'Account created successfully' });
      });
    });
  } catch (err) {
    logger.error('Error hashing password:', err);
    res.status(500).json({ error: 'Error hashing password' });
  }
});


// Test DB connection
app.get('/test-db', (req, res) => {
  db.query('SELECT 1 + 1 AS result', (err, results) => {
    if (err) {
      logger.error('Database test failed:', err);
      return res.status(500).json({ error: 'Database test failed', details: err.message });
    }
    res.status(200).json({ result: results[0].result });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});