const express = require('express');
const ideasRouter = express.Router();
const db = require('./db');
const getAllFromDatabase = db.getAllFromDatabase;
const getFromDatabaseById = db.getFromDatabaseById;
const addToDatabase = db.addToDatabase;
const updateInstanceInDatabase = db.updateInstanceInDatabase;
const deleteFromDatabasebyId = db.deleteFromDatabasebyId;

const getIdeas = (req, res, next) => {
    const ideas = getAllFromDatabase('ideas');
    res.send(ideas); 
};

ideasRouter.get('/', getIdeas);

ideasRouter.post('/', (req, res, next)=> {
    const idea = addToDatabase('ideas', req.body);
    res.status(201).send(idea);
});

ideasRouter.param('ideaId', (req, res, next, ideaId) => {
    const id = Number(ideaId);
    if(id === NaN) {
        const error = new Error(`id has to be a number`);
        error.status = 404;
        return next(error); 
    }
    try {
      const found = getFromDatabaseById('ideas', id);
      if (found !== null) {
        req.idea = found;
        next();
      } else {
        const error = new Error(`Idea with this id (${id}) is not in the database`);
        error.status = 404;
        return next(error);
      }
    } catch (err) {
      return next(err);
    }
  });
 

ideasRouter.get('/:ideaId', (req, res, next) => {
    res.send(req.idea);
});

ideasRouter.put('/:ideaId', (req, res, next) => {
    let updatedIdeaInstance = updateInstanceInDatabase('ideas', req.body);
    res.status(200).send(updatedIdeaInstance);
  });

ideasRouter.delete('/:ideaId', (req, res, next)=> {
    const deleted = deleteFromDatabasebyId('ideas', req.idea.id);
    if (deleted) {
        res.status(204);
      } else {
        res.status(500);
      }
      res.send();
})



module.exports = ideasRouter;