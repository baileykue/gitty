const { Router } = require('express');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');
const GithubUser = require('../models/GithubUser');
const { sign } = require('../utils/jwt');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', (req, res, next) => {
    res
      .redirect(
        `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=${process.env.REDIRECT_URI}`
      )
      .catch((error) => next(error));
  })
  .get('/login/callback', (req, res, next) => {
    let profile;

    return exchangeCodeForToken(req.query.code)
      .then((token) => getGithubProfile(token))
      .then(({ username, avatar, email }) => {
        console.log({ username, avatar, email });
        profile = { username, avatar, email };
        return GithubUser.findByUsername({ username });
      })
      .then((user) => {
        if (!user) {
          return GithubUser.insert(profile);
        } else {
          return user;
        }
      })
      .then((user) => {
        console.log(user);
        res
          .cookie(process.env.COOKIE_NAME, sign(user), {
            httpOnly: true,
            maxAge: ONE_DAY_IN_MS,
          })
          .redirect('/api/v1/posts');
      })
      .catch((error) => next(error));
  })
  .delete('/logout', (req, res, next) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ message: 'you have been logged out' })
      .catch((error) => next(error));
  });
