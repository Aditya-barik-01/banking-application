// server.js
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve index.html and other static files

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',     // change if needed
  password: '',     // your DB password
  database: 'contact_form_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// POST route to save messages
app.post('/api/messages', (req, res) => {
  const { name, email, comment } = req.body;
  
  if (!name || !email || !comment) {
    return res.status(400).send('All fields are required');
  }

  const sql = 'INSERT INTO messages (name, email, comment) VALUES (?, ?, ?)';
  db.query(sql, [name, email, comment], (err) => {
    if (err) throw err;
    res.send('Message saved successfully!');
  });
});

// GET route to view messages (for owner)
app.get('/api/messages', (req, res) => {
  db.query('SELECT * FROM messages ORDER BY submitted_at DESC', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
