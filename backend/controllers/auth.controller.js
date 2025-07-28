const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/auth/register
exports.register = async (req, res) => {
  const { username, password,role } = req.body;
  try {
    if (!username || !password || ! role) {
      return res.status(400).json({ message: 'Username and password and role required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();

     console.log(hashedPassword)
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt for username:', username);

  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const user = await User.findOne({ username });
    // console.log('User from DB:', user);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials (no user)' });
    }

    //  console.log('Found user:', user);
    // console.log('Stored password hash:', user.password);
    // console.log('Entered password:', password);
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials (wrong password)' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({ token, role:user.role });

  } catch (err) {
    return res.status(500).json({ message: 'Login failed', error: err.message });
  }
};