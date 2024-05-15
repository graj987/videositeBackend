const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

// Database connection
// Database connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// Check database connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// API endpoint to get all videos
app.get('/api/videos', (req, res) => {
  const query = 'SELECT * FROM videos';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching videos:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

app.get('/api/videos/:id', (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM videos WHERE id = ${id}`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching video by ID:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Video not found' });
      return;
    }
    res.json(results[0]);

  });
});
app.get('/search', (req, res) => {
  const query = req.query.q; // Get search query from request query parameters
  if (!query) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  // Perform search in the database
  const sql = `SELECT * FROM Videos WHERE name LIKE '%${query}%' OR description LIKE '%${query}%'`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error searching database: ', err);
      return res.status(500).json({ error: 'Error searching database' });
    }
    res.json(results);
  });
});
 
// API endpoint to create a new video
app.post('/api/videos', (req, res) => {
  const { title, src, likes, thumbnail } = req.body;
    
  // Check if title, src, and thumbnail are provided
  if (!title || !src || !thumbnail) {
    return res.status(400).json({ error: 'Title, src, and thumbnail are required' });
  }

  const query = 'INSERT INTO videos (title, src, likes, thumbnail) VALUES (?, ?, ?, ?)';
  connection.query(query, [title, src, likes, thumbnail], (err, result) => {
    if (err) {
      console.error('Error creating video:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ id: result.insertId });
  });
});





app.get('/api/comments', (req, res) => {
  const query = 'SELECT * FROM comments';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching videos:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/comments', (req, res) => {
    const { video_id, comment } = req.body;

    // Check if video_id and comment are provided in the request body
    if (!video_id || !comment) {
        res.status(400).json({ error: 'Video ID and comment are required' });
        return;
    }

    const query = 'INSERT INTO comments (video_id, comment) VALUES (?, ?)';
    connection.query(query, [video_id, comment], (err, result) => {
        if (err) {
            console.error('Error creating comment:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json({ id: result.insertId });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));