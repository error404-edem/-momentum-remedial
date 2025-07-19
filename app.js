const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();


// ✏️ Replace this with your real MongoDB connection string
const mongoURI = 'mongodb+srv://agboblielliot:MkVqYbowNVkYB1Tr@cluster0.ggqeedv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const Student = mongoose.model('Student', {
  name: String,
  age: String,
  classLevel: String
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'momentum_secret_key',
  resave: false,
  saveUninitialized: true
}));

const USER = {
  username: 'momentumadmin',
  password: 'momentum123'
};

app.get('/', (req, res) => res.redirect('/login'));

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === USER.username && password === USER.password) {
    req.session.auth = true;
    res.redirect('/dashboard');
  } else {
    res.render('login', { error: 'Invalid credentials' });
  }
});

app.get('/dashboard', async (req, res) => {
  if (!req.session.auth) return res.redirect('/login');
  const students = await Student.find();
  res.render('dashboard', { students });
});

app.get('/register', (req, res) => {
  if (!req.session.auth) return res.redirect('/login');
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { name, age, classLevel } = req.body;
  await Student.create({ name, age, classLevel });
  res.redirect('/dashboard');
});

// ✅ Make sure this is the ONLY place you define PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Momentum Remedial School app running at http://localhost:${PORT}`);
});

