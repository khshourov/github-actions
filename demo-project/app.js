const express = require('express');
const mysql = require('mysql2/promise');
const redis = require('redis');

const app = express();
const port = 3000;

app.use(express.json());

// MySQL connection
const mysqlPool = mysql.createPool({
  host: 'mysql',
  user: 'root',
  password: 'password',
  database: 'comments_db',
});

// Redis connection
const redisClient = redis.createClient({
  url: 'redis://redis:6379',
});
redisClient.connect();

// POST /comments
app.post('/comments', async (req, res) => {
  const { comment } = req.body;
  if (!comment) {
    return res.status(400).json({ error: 'Comment is required' });
  }

  try {
    const [result] = await mysqlPool.execute('INSERT INTO comments (comment) VALUES (?)', [comment]);
    res.status(201).json({ id: result.insertId, comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// GET /comments/:id
app.get('/comments/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Check Redis cache
    const cachedComment = await redisClient.get(`comment:${id}`);
    if (cachedComment) {
      return res.json({ id, comment: cachedComment });
    }

    // Fetch from MySQL if not in Redis
    const [rows] = await mysqlPool.execute('SELECT * FROM comments WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const comment = rows[0].comment;

    // Cache in Redis
    await redisClient.set(`comment:${id}`, comment);

    res.json({ id, comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch comment' });
  }
});

app.get('/health-check', (req, res) => {
    return res.json({status: 'UP'});
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
