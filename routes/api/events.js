const express = require('express');

const router = express.Router();
// Load Event model
const Event = require('../../models/Event');

router.get('/', (req, res) => {
  Event.find().then(events => {
    res.json(events);
  });
});

// @route GET api/Events/:id
// @desc Get one Event by id
router.get('/:id', (req, res) => {
  const itemId = req.params.id;

  Event.findById(itemId).then(event => {
    // Check if event exists
    if (!event) {
      return res.status(404).json({ errorMsg: 'Event not found' });
    }

    res.json(event);
  });
});

router.get('/group/:id', (req, res) => {
  const itemId = req.params.id;

  Event.find({ group: itemId }).then(events => {
    res.json(events);
  });
});

// @route GET api/events/:id
// @desc Update one event by id
router.put('/:id', (req, res) => {
  const filter = { _id: req.params.id };
  const update = req.body;
  Event.findOneAndUpdate(filter, update, {
    new: true,
  }).then(event => {
    // Check if Event exists
    if (!event) {
      return res.status(404).json({ errorMsg: 'Event not found' });
    }

    res.json(event);
  });
});

router.delete('/:id', (req, res) => {
  Event.deleteOne({ _id: req.params.id }, function(err) {
    if (err) return err;
  }).then(event => {
    if (!event) {
      return res.status(404).json({ errorMsg: 'Event not found' });
    }

    res.json(event);
  });
});

module.exports = router;
