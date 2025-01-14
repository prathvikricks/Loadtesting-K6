const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken'); // To handle tokens
const app = express();
const port = 3000;

// Default credentials
const DEFAULT_USER = {
  username: 'admin',
  password: 'password123'
};

// JWT Secret
const JWT_SECRET = 'your-jwt-secret-key';

// Middleware
app.use(express.json()); // Add this for parsing JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: false
}));
app.set('view engine', 'ejs');

// Authentication middleware
const requireLogin = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Token validation middleware
const requireToken = (req, res, next) => {
  const token = req.headers['x-auth-token'];
  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user data from token to request
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Routes
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === DEFAULT_USER.username && password === DEFAULT_USER.password) {
    req.session.isAuthenticated = true;
    req.session.username = username;
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' }); // Generate JWT
    res.json({ message: 'Login successful', token });
  } else {
    res.status(401).render('login', { error: 'Invalid credentials' });
  }
});

app.get('/dashboard', requireLogin, (req, res) => {
  res.render('dashboard', { username: req.session.username });
});

// Web session logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// API token logout
app.post('/logout', requireToken, (req, res) => {
  // In a real application, you might want to blacklist the token
  // For this example, we'll just return a success response
  res.status(200).json({ message: 'Logged out successfully' });
});

app.get('/token', requireLogin, (req, res) => {
  const token = jwt.sign({ username: req.session.username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.get('/time', requireToken, (req, res) => {
  const currentTime = new Date().toISOString();
  res.json({ message: 'Current time', time: currentTime });
});

app.get('/random-message', requireToken, (req, res) => {
  const messages = ['Hello World!', 'Welcome to the server', 'Node.js is awesome!', 'Express makes it easy!'];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  res.json({ message: randomMessage });
});

// Default route
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});