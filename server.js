const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan')


module.exports = app;

/* Do not change the following line! It is required for testing and allowing
*  the frontend application to interact as planned with the api server
*/
const PORT = process.env.PORT || 4001;

// Add middleware for handling CORS requests from index.html
app.use(cors());
app.use(morgan('tiny'));
// Add middware for parsing request bodies here:
app.use(bodyParser.json());

// Mount your existing apiRouter below at the '/api' path.
const apiRouter = require('./server/api');
app.use('/api', apiRouter);


//Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).send(err.message);
})

// This conditional is here for testing purposes:
if (!module.parent) { 
  app.listen(PORT, ()=> {
    console.log(`Listening at port ${PORT}`);
  })

}
