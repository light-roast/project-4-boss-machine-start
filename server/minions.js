const express = require('express');
const minionsRouter = express.Router();
const db = require('./db');
const getAllFromDatabase = db.getAllFromDatabase;
const getFromDatabaseById = db.getFromDatabaseById;

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
    try {
      const found = getFromDatabaseById('minions', id);
      if (found !== null) {
        req.minion = found;
        next();
      } else {
        next(new Error(`Minion with this id (${id}) is not in the database`));
      }
    } catch (err) {
      next(err);
    }
  });
 
//Configure .get middleware to send the correct req.minion
minionsRouter.get('/:minionId', (req, res, next) => {
    res.send(req.minion);
});

module.exports = minionsRouter;