const express = require('express');

const router = express.Router();
// Load Group model
const Group = require('../../models/Group');

router.get('/', (req, res) => {
  Group.find().then(groups => {
    res.json(groups);
  });
});

// @route GET api/Groups/:id
// @desc Get one Group by id
router.get('/:id', (req, res) => {
  const itemId = req.params.id;

  Group.findById(itemId).then(group => {
    // Check if group exists
    if (!group) {
      return res.status(404).json({ groupnotfound: 'Group not found' });
    }

    res.json({ group });
  });
});

// @route POST api/groups/
// @desc Create group
// @access Public
router.post('/', (req, res) => {
  const newGroup = new Group({
    name: req.body.name,
    description: req.body.description,
    members: req.body.members,
    interests: req.body.interests,
    comments: req.body.comments,
    status: req.body.status,
  });

  newGroup
    .save()
    .then(group => res.json(group))
    .catch(err => console.log(err));
});

// @route GET api/groups/:id
// @desc Update one group by id
router.put('/:id', (req, res) => {
  const filter = { _id: req.params.id };
  const update = req.body;
  Group.findOneAndUpdate(filter, update, {
    new: true,
  }).then(group => {
    // Check if Group exists
    if (!group) {
      return res.status(404).json({ groupnotfound: 'Group not found' });
    }

    res.json({ group });
  });
});

router.delete('/:id', (req, res) => {
  Group.deleteOne({ _id: req.params.id }, function(err) {
    if (err) return err;
  }).then(group => {
    if (!group) {
      return res.status(404).json({ groupnotfound: 'Group not found' });
    }

    res.json({ group });
  });
});

module.exports = router;
