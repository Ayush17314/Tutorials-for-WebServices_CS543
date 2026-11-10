// server.js — complete secured Catalogue API
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const app = express();

app.use(express.json());
// Serve static frontend files if public folder exists
app.use(express.static(path.join(__dirname, 'public')));

const SECRET = 'dev-secret-change-me'; // real life: process.env.JWT_SECRET

// two users -- passwords hashed once at startup, never stored in plain text
const users = [
  { id: 1, email: 'asha@campus.edu', role: 'customer', hash: bcrypt.hashSync('customer123', 10) },
  { id: 2, email: 'mealhub@campus.edu', role: 'restaurant', hash: bcrypt.hashSync('resto123', 10) },
];

let items = [
  { id: 1, name: 'Veg Thali', price: 90 },
  { id: 2, name: 'Paneer Roll', price: 70 },
];
let nextId = 3;

// POST /login -- verify the password, hand back a JWT
app.post('/login', (req, res) => {
  const user = users.find(u => u.email === req.body.email);
  if (!user || !bcrypt.compareSync(req.body.password, user.hash))
    return res.status(401).json({ error: 'bad login' });
  const token = jwt.sign({ sub: user.id, role: user.role }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Authentication middleware -- verify the token (who are you?)
function auth(req, res, next) {
  const token = (req.get('Authorization') || '').split(' ')[1]; // "Bearer <token>"
  try {
    req.user = jwt.verify(token, SECRET);
    next(); // ok -> carry on
  } catch {
    res.status(401).json({ error: 'invalid or missing token' });
  }
}

// Authorization middleware -- require one of the allowed roles (may you do this?)
function requireRole(...allowed) {
  return (req, res, next) =>
    allowed.includes(req.user.role) ? next() : res.status(403).json({ error: 'forbidden' });
}

// GET /items -- any authenticated user may read the menu
app.get('/items', auth, (req, res) => res.json(items));

// GET /items/:id -- optional single item retrieval
app.get('/items/:id', auth, (req, res) => {
  const item = items.find(i => i.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'not found' });
  res.json(item);
});

// POST /items -- only a restaurant (or admin) may add a dish
app.post('/items', auth, requireRole('restaurant', 'admin'), (req, res) => {
  const { name, price } = req.body;
  if (!name) return res.status(422).json({ error: 'name required' });
  const item = { id: nextId++, name, price: Number(price) || 0 };
  items.push(item);
  res.status(201).json(item);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Secured Catalogue on http://localhost:${port}`));
