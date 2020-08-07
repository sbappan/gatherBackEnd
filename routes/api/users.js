const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const postmark = require('postmark');

const client = new postmark.ServerClient(process.env.POSTMARK_KEY);

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
      photo: req.body.photo,
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
          .then(user2 => {
            const name = `${user2.fname} ${user2.lname}`;

            client.sendEmailWithTemplate({
              From: 'hello@gatherapp.xyz',
              To: user2.email,
              TemplateAlias: 'welcome',
              TemplateModel: {
                product_url: 'https://gatherapp.xyz/',
                product_name: 'Gather',
                name,
                action_url: 'https://gatherapp.xyz/',
                login_url: 'https://gatherapp.xyz/',
                email: user2.email,
                sender_name: 'Marco',
                company_name: 'Gather Inc.',
                company_address: '1750 Finch Ave E, North York, ON M2J 2X5',
              },
            });

            return res.json(user2);
          })
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
            name: `${user.fname} ${user.lname}`,
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

router.post('/forgot', (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      // User matched
      // Create JWT Payload
      const name = `${user.fname} ${user.lname}`;

      const payload = {
        id: user.id,
        name,
      };
      // Sign token
      jwt.sign(
        payload,
        process.env.SECRET_KEY,
        {
          expiresIn: 3600, // 1 hour in seconds
        },
        (err, token) => {
          const url = `https://${req.body.appUrl}/password/reset/${user._id}/${token}`;

          client.sendEmailWithTemplate({
            From: 'hello@gatherapp.xyz',
            To: user.email,
            TemplateAlias: 'password-reset',
            TemplateModel: {
              product_url: 'https://gatherapp.xyz/',
              product_name: 'Gather',
              name,
              action_url: url,
              company_name: 'Gather Inc.',
              company_address: '1750 Finch Ave E, North York, ON M2J 2X5',
            },
          });
        }
      );

      return res.json({
        message: 'A reset link will be sent to your email shortly',
      });
    }

    return res.status(404).json({ message: 'Email does not exist' });
  });
});

router.post('/reset', (req, res) => {
  User.findOne({ _id: req.body.id }).then(user => {
    if (user) {
      // User matched
      // Create JWT Payload
      const payload = jwt.decode(req.body.token, process.env.SECRET_KEY);

      if (payload.id === req.body.id) {
        // Hash password before saving in database
        bcrypt.genSalt(12, (err, salt) => {
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) throw err;
            User.findOneAndUpdate({ _id: req.body.id }, { password: hash })
              .then(() =>
                res.status(202).json({
                  message:
                    'Password has been reset. Please log in with the new password',
                })
              )
              .catch(err => res.status(500).json(err));
          });
        });
      } else {
        return res.status(404).json({
          message:
            'The reset link has expired. Please request a new reset link.',
        });
      }
    } else {
      return res.status(404).json({ message: 'User does not exist' });
    }
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
