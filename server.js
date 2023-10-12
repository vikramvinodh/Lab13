const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: 'Vikram@1512',
  database: 'notes_app2',
};

const pool = mysql.createPool(dbConfig);

app.post('/api/notes', (req, res) => {
  const { title, contents, created } = req.body;

  pool.query(
    'INSERT INTO notes2 (title, contents, created) VALUES (?, ?, ?)',
    [title, contents, created],
    (err, result) => {
      if (err) {
        console.error('Error creating note:', err);
        res.status(500).json({ error: 'Error creating note' });
      } else {
        res.status(201).json({ message: 'Note created successfully' });
      }
    }
  );
});

// Read (GET) all notes or a specific note by ID
app.get('/api/notes', (req, res) => {
  const { id } = req.query;

  if (id) {
    pool.query('SELECT * FROM notes2 WHERE id = ?', [id], (err, results) => {
      if (err) {
        console.error('Error fetching note:', err);
        res.status(500).json({ error: 'Error fetching note' });
      } else {
        if (results.length === 0) {
          res.status(404).json({ error: 'Note not found' });
        } else {
          res.status(200).json(results[0]);
        }
      }
    });
  } else {
    pool.query('SELECT * FROM notes2', (err, results) => {
      if (err) {
        console.error('Error fetching notes:', err);
        res.status(500).json({ error: 'Error fetching notes' });
      } else {
        res.status(200).json(results);
      }
    });
  }
});

// Update (PUT) a note by ID
app.put('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const { title, contents, created } = req.body;

  pool.query(
    'UPDATE notes2 SET title = ?, contents = ?, created = ? WHERE id = ?',
    [title, contents, created, id],
    (err, result) => {
      if (err) {
        console.error('Error updating note:', err);
        res.status(500).json({ error: 'Error updating note' });
      } else {
        res.status(200).json({ message: 'Note updated successfully' });
      }
    }
  );
});

// Delete (DELETE) a note by ID
app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;

  pool.query('DELETE FROM notes2 WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting note:', err);
      res.status(500).json({ error: 'Error deleting note' });
    } else {
      res.status(200).json({ message: 'Note deleted successfully' });
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
