const authenticate = require('../middleware/authenticate');
const { Router } = require('express');
const Quote = require('../models/Quote');

module.exports = Router().get('/', (req, res, next) => {
  Quote.getAll()
    .then((quote) => res.send(quote))
    .catch((error) => next(error));
});
