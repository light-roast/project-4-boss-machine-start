const express = require('express');
const minionsRouter = express.Router();
const db = require('./db');
const getAllFromDatabase = db.getAllFromDatabase;
const getFromDatabaseById = db.getFromDatabaseById;
const addToDatabase = db.addToDatabase;
const updateInstanceInDatabase = db.updateInstanceInDatabase;
const deleteFromDatabasebyId = db.deleteFromDatabasebyId;

//Set a function to retrieve all minions on the DB
const getMinions = (req, res, next) => {
    const minions = getAllFromDatabase('minions');
    res.send(minions); 
};

//Middleware to give all minions on the DB
minionsRouter.get('/', getMinions);

//Use .param so that at first the middleware add the correct req.miniom if in DB
minionsRouter.param('minionId', (req, res, next, minionId) => {
    const id = Number(minionId);
    if(id === NaN) {
        const error = new Error(`id has to be a number`);
        error.status = 404;
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
 
//Configure .get middleware to send the correct req.minion
minionsRouter.get('/:minionId', (req, res, next) => {
    res.send(req.minion);
});

//Configure .post middleware to post new minions on DB
minionsRouter.post('/', (req, res, next)=> {
    if('name' in req.body && 'title' in req.body && 'salary' in req.body) {
        if(typeof req.body.name === 'string' && typeof req.body.title === 'string' && typeof req.body.salary === 'number') {
            const minion = addToDatabase('minions', req.body);
            res.status(201).send(minion);
        } else {
            const error = new Error(`Please correct the format of all the attributes of the request, only salary is a number and the rest are string`);
            error.status = 400;
            return next(error); 
        }
    } else {
        const error = new Error(`Please include a request with all the attributes: name, title and salary`);
        error.status = 400;
        return next(error);
    }
});

//Middleware to update minion
minionsRouter.put('/:minionId', (req, res, next) => {
    let updatedMinionInstance = updateInstanceInDatabase('minions', req.body);
    res.status(200).send(updatedMinionInstance);
  });

//Middleware to delete a minion
minionsRouter.delete('/:minionId', (req, res, next)=> {
    const deleted = deleteFromDatabasebyId('minons', req.body.id);
    if (deleted) {
        res.status(204);
      } else {
        res.status(500);
      }
      res.send();
});

module.exports = minionsRouter;