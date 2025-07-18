//simple Express backend for session-based authentication
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

//in-memory user store (for demo purposes)
const users = {};

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000', //dev server
  credentials: true
}));
app.use(session({
  secret: 'supersecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: false }
}));

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }
  if (users[username]) {
    return res.status(409).json({ error: 'User already exists' });
  }
  users[username] = { password };
  req.session.user = username;
  res.json({ success: true });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  req.session.user = username;
  res.json({ success: true });
});

app.get('/me', (req, res) => {
  if (req.session.user) {
    res.json({ username: req.session.user });
  } else {
    res.status(401).json({ error: 'Not logged in' });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
});
