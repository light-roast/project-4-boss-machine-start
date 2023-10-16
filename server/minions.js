const express = require('express');
const minionsRouter = express.Router();
const db = require('./db');
const {
  getAllFromDatabase,
  getFromDatabaseById,
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabaseById,
} = db;

// Set a function to retrieve all minions from the DB
const getMinions = (req, res, next) => {
  const minions = getAllFromDatabase('minions');
  res.send(minions);
};

// Middleware to get all minions from the DB
minionsRouter.get('/', getMinions);

// Use .param to validate and add the correct req.minion if it exists in the DB
minionsRouter.param('minionId', (req, res, next, minionId) => {
  const id = Number(minionId);
  if (isNaN(id)) {
    const error = new Error('ID must be a number');
    error.status = 400;
    return next(error);
  }

  try {
    const found = getFromDatabaseById('minions', id);
    if (found !== null) {
      req.minion = found;
      next();
    } else {
      const error = new Error(`Minion with this id (${id}) is not in the database`);
      error.status = 404;
      return next(error);
    }
  } catch (err) {
    return next(err);
  }
});

// Configure .get middleware to send the correct req.minion
minionsRouter.get('/:minionId', (req, res, next) => {
  res.send(req.minion);
});

// Middleware to add a new minion to the DB
minionsRouter.post('/', (req, res, next) => {
  if ('name' in req.body && 'title' in req.body && 'salary' in req.body) {
    if (typeof req.body.name === 'string' && typeof req.body.title === 'string' && typeof req.body.salary === 'number') {
      const minion = addToDatabase('minions', req.body);
      res.status(201).send(minion);
    } else {
      const error = new Error('Please correct the format of the attributes in the request. Only salary should be a number, and the rest should be strings.');
      error.status = 400;
      return next(error);
    }
  } else {
    const error = new Error('Please include a request with all the attributes: name, title, and salary.');
    error.status = 400;
    return next(error);
  }
});

// Middleware to update a minion
minionsRouter.put('/:minionId', (req, res, next) => {
  let updatedMinionInstance = updateInstanceInDatabase('minions', req.body);
  res.status(200).send(updatedMinionInstance);
});

// Middleware to delete a minion
minionsRouter.delete('/:minionId', (req, res, next) => {
  const deleted = deleteFromDatabaseById('minions', req.minion.id);
  if (deleted) {
    res.status(204).send();
  } else {
    const error = new Error(`Failed to delete minion with ID ${req.minion.id}`);
    error.status = 500;
    return next(error);
  }
});

module.exports = minionsRouter;
