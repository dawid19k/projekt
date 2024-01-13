const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const app = express();
app.use(cors());
app.use(express.json());

//MongoDB

mongoose.connect('mongodb+srv://admin:haslo@projekt.dhwgmza.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Item = mongoose.model('Item', itemSchema);

// Pobieranie wszystkich elementów
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dodawanie nowego przedmiotu
app.post('/api/items', async (req, res) => {
  const item = new Item({
    name: req.body.name,
    description: req.body.description,
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Usuwanie przedmiotu
app.delete('/api/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndRemove(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Edytowanie przedmiotu
app.put('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    item.name = req.body.name;
    item.description = req.body.description;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Definiuj schemat użytkownika
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// Twórz model użytkownika
const User = mongoose.model('User', userSchema);

// Dodaj obsługę sesji
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Rejestracja nowego użytkownika 
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Logowanie
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      req.session.loggedIn = true;
      req.session.username = username;
      res.json({ message: 'Login successful' });
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

// Wylogowanie
app.get('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ message: 'Error logging out' });
    } else {
      res.json({ message: 'Logged out successfully' });
    }
  });
});