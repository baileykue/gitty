const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Post = require('../models/Post');

module.exports = Router()
  .post('/', authenticate, (req, res, next) => {
    const { id } = req.user;
    const { description } = req.body;
    Post.create({ description, id })
      .then((post) => res.send(post))
      .catch((error) => next(error));
  })
  .get('/', authenticate, (req, res, next) => {
    Post.getAll()
      .then((post) => res.send(post))
      .catch((error) => next(error));
  });
