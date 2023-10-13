const express = require('express');
const minionsRouter = express.Router();
const db = require('./db');
const getAllFromDatabase = db.getAllFromDatabase;
const getMinions = (req, res, next) => {
    const minions = getAllFromDatabase('minions');
    res.send(minions); 
};
minionsRouter.get('/', getMinions);

module.exports = minionsRouter;