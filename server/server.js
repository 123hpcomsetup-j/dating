const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || 'secretkey';

app.use(cors());
app.use(express.json());
app.use(express.static('../client'));

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { name, email, password, role, location, profilePhoto } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const hash = await bcrypt.hash(password, 10);
  const id = uuidv4();
  db.run(
    `INSERT INTO users (id, name, email, password, role, location, profilePhoto, isOnline) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, name, email, hash, role || 'user', location || '', profilePhoto || '', 0],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'User creation failed' });
      }
      res.json({ id });
    }
  );
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role });
  });
});

// Auth middleware
function auth(role) {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      if (role && user.role !== role) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };
}

// Protected route example
app.get('/profile', auth(), (req, res) => {
  db.get('SELECT id, name, email, role, location, profilePhoto, isOnline FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err || !user) return res.sendStatus(404);
    res.json(user);
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
