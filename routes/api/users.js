const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
// Load User model
const User = require('../../models/User');

// @route POST api/users/register
// @desc Register user
// @access Public
router.post('/register', (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const newUser = new User({
      userName: req.body.userName,
      email: req.body.email.toLowerCase(),
      password: req.body.password,
      fname: req.body.fname,
      lname: req.body.lname,
      dob: req.body.dob,
      interests: req.body.interests,
      status: req.body.status,
      emailUpdates: req.body.emailUpdates,
    });
    // Hash password before saving in database
    bcrypt.genSalt(12, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user2 => res.json(user2))
          .catch(err => console.log(err));
      });
    });
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post('/login', (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email.toLowerCase();
  const { password } = req.body;
  // Find user by email
  User.findOne({ email })
    .select('+password')
    .then(user => {
      // Check if user exists
      if (!user) {
        return res.status(404).json({ message: 'Email not found' });
      }
      // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            id: user.id,
            name: user.name,
          };
          // Sign token
          jwt.sign(
            payload,
            process.env.SECRET_KEY,
            {
              expiresIn: 31556926, // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                message: 'Login successful',
                token,
              });
            }
          );
        } else {
          return res.status(400).json({ message: 'Password incorrect' });
        }
      });
    });
});

router.get('/', (req, res) => {
  User.find().then(users => {
    res.json(users);
  });
});

// @route GET api/users/:id
// @desc Get one user by id
router.get('/:id', (req, res) => {
  const itemId = req.params.id;

  User.findById(itemId).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  });
});

// @route GET api/users/:id
// @desc Update one user by id
router.put('/:id', (req, res) => {
  const filter = { _id: req.params.id };
  const update = req.body;
  User.findOneAndUpdate(filter, update, {
    new: true,
  }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  });
});

router.delete('/:id', (req, res) => {
  User.deleteOne({ _id: req.params.id }, function(err) {
    if (err) return err;
  }).then(user => {
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  });
});

module.exports = router;
