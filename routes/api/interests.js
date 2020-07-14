const express = require('express');

const router = express.Router();
// Load Interest model
const Interest = require('../../models/Interest');

router.get('/', (req, res) => {
  Interest.find().then(interests => {
    res.json(interests);
  });
});

// @route GET api/Interests/:id
// @desc Get one Interest by id
router.get('/:id', (req, res) => {
  const itemId = req.params.id;

  Interest.findById(itemId).then(interest => {
    // Check if interest exists
    if (!interest) {
      return res.status(404).json({ interestnotfound: 'Interest not found' });
    }

    res.json({ interest });
  });
});

// @route POST api/interests/
// @desc Create interest
// @access Public
router.post('/', (req, res) => {
  const newInterest = new Interest({
    name: req.body.name,
    description: req.body.description,
    members: req.body.members,
    interests: req.body.interests,
    comments: req.body.comments,
    status: req.body.status,
  });

  newInterest
    .save()
    .then(interest => res.json(interest))
    .catch(err => console.log(err));
});

// @route GET api/interests/:id
// @desc Update one interest by id
router.put('/:id', (req, res) => {
  const filter = { _id: req.params.id };
  const update = req.body;
  Interest.findOneAndUpdate(filter, update, {
    new: true,
  }).then(interest => {
    // Check if Interest exists
    if (!interest) {
      return res.status(404).json({ interestnotfound: 'Interest not found' });
    }

    res.json({ interest });
  });
});

router.delete('/:id', (req, res) => {
  Interest.deleteOne({ _id: req.params.id }, function(err) {
    if (err) return err;
  }).then(interest => {
    if (!interest) {
      return res.status(404).json({ interestnotfound: 'Interest not found' });
    }

    res.json({ interest });
  });
});

module.exports = router;
