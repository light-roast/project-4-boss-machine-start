const express = require('express');
const apiRouter = express.Router();
apiRouter.use((req, res, next) => {
    console.log('Request recieved');
    next();
});


module.exports = apiRouter;
