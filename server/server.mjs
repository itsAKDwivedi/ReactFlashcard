import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json()); // Middleware to parse JSON bodies

// Updated MySQL connection details for Railway
const connection = mysql.createConnection({
  host: 'viaduct.proxy.rlwy.net',
  user: 'root',
  password: 'whximmndsghdzIHAYYodeBpxVxOuxhCI',
  database: 'railway',
  port: 51498, // Make sure to use the correct port from Railway
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

// Fetch all flashcards
app.get('/api/data', (req, res) => {
  connection.query('SELECT id, question, answer FROM flashcards', (error, results) => {
    if (error) {
      console.error('Database query error', error);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

// Add a new flashcard
app.post('/api/data', (req, res) => {
  const { question, answer } = req.body;
  connection.query(
    'INSERT INTO flashcards (question, answer) VALUES (?, ?)',
    [question, answer],
    (error, results) => {
      if (error) {
        console.error('Database query error', error);
        res.status(500).send('Server error');
        return;
      }
      res.json({ id: results.insertId, question, answer });
    }
  );
});

// Edit a flashcard
app.put('/api/data/:id', (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;
  connection.query(
    'UPDATE flashcards SET question = ?, answer = ? WHERE id = ?',
    [question, answer, id],
    (error, results) => {
      if (error) {
        console.error('Database query error', error);
        res.status(500).send('Server error');
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).send('Card not found');
        return;
      }
      res.json({ id, question, answer });
    }
  );
});

// Delete a flashcard
app.delete('/api/data/:id', (req, res) => {
  const { id } = req.params;
  connection.query(
    'DELETE FROM flashcards WHERE id = ?',
    [id],
    (error, results) => {
      if (error) {
        console.error('Database query error', error);
        res.status(500).send('Server error');
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).send('Card not found');
        return;
      }
      res.status(204).send(); // No content
    }
  );
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
