//Core logic of our backend

const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const { getDB } = require('../config/db');
//Register
exports.register = async (req, res) => {
  const { username, password, phno } = req.body;

  if (!username || !password || !phno) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const users = getDB().collection('users');
    const existingUser = await users.findOne({ username });

    if (existingUser) {
      return res.status(401).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = generateToken(username);

    const newUser = { username, password: hashedPassword, phno, jwtToken: token };
    await users.insertOne(newUser);

    res.status(200).json({ message: 'User registered', token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

//Login
exports.login = async (req, res) => {
  const { username, password } = req.query;

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }

  try {
    const users = getDB().collection('users');
    const user = await users.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'No account with that username' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    res.status(200).json({ message: 'Login successful', token: user.jwtToken });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
