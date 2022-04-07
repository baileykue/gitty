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
  .get('/', authenticate, async (req, res, next) => {
    try {
      const posts = await Post.getAll();
      res.send(posts);
    } catch (error) {
      next(error);
    }
  });
