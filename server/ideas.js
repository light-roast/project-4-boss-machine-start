const express = require('express');
const ideasRouter = express.Router();
const db = require('./db');
const {
  getAllFromDatabase,
  getFromDatabaseById,
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabaseById,
} = db;

const getIdeas = (req, res, next) => {
  const ideas = getAllFromDatabase('ideas');
  res.status(200).send(ideas);
};

ideasRouter.get('/', getIdeas);

ideasRouter.post('/', (req, res, next) => {
  const idea = addToDatabase('ideas', req.body);
  res.status(201).send(idea);
});

ideasRouter.param('ideaId', (req, res, next, ideaId) => {
  const id = Number(ideaId);
  if (isNaN(id)) {
    const error = new Error('ID must be a number');
    error.status = 400;
    return next(error);
  }

  const found = getFromDatabaseById('ideas', id);
  if (!found) {
    const error = new Error(`Idea with ID ${id} not found`);
    error.status = 404;
    return next(error);
  }

  req.idea = found;
  next();
});

ideasRouter.get('/:ideaId', (req, res, next) => {
  res.status(200).send(req.idea);
});

ideasRouter.put('/:ideaId', (req, res, next) => {
  const updatedIdeaInstance = updateInstanceInDatabase('ideas', req.body);
  res.status(200).send(updatedIdeaInstance);
});

ideasRouter.delete('/:ideaId', (req, res, next) => {
  const deleted = deleteFromDatabaseById('ideas', req.idea.id);
  if (deleted) {
    res.status(204).send();
  } else {
    const error = new Error(`Failed to delete idea with ID ${req.idea.id}`);
    error.status = 500;
    return next(error);
  }
});

module.exports = ideasRouter;
