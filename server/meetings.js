const express = require('express');
const meetingsRouter = express.Router();
const db = require('./db');
const {
  getAllFromDatabase,
  createMeeting,
  deleteAllFromDatabase
} = db;

const getmeetings = (req, res, next) => {
  const meetings = getAllFromDatabase('meetings');
  res.status(200).send(meetings);
};

meetingsRouter.get('/', getmeetings);

meetingsRouter.post('/', (req, res, next) => {
    const meeting = createMeeting();
    res.status(201).send(meeting);
});

meetingsRouter.delete('/', (req, res, next) =>{
    const deleted = deleteAllFromDatabase('meetings');
  if (deleted) {
    res.status(204).send(deleted);
  } else {
    const error = new Error(`Failed to delete all meetings`);
    error.status = 500;
    return next(error);
  }
});

module.exports = meetingsRouter;
