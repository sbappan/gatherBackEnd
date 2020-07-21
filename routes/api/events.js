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

// @route POST api/events/
// @desc Create group
// @access Public
router.post('/', (req, res) => {
  const newEvent = new Event({
    name: req.body.name,
    description: req.body.description,
    group: req.body.group,
    attendees: req.body.attendees,
    location: req.body.location,
    status: req.body.status,
    date: req.body.date,
    reviews: req.body.reviews,
    createdBy: req.body.createdBy,
    updatedBy: req.body.updatedBy,
  });

  newEvent
    .save()
    .then(group => res.json(group))
    .catch(err => res.json(err));
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
