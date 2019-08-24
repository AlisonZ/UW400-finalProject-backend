const router = require('express').Router();
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const User = require('../models/user');
const { SECRET_KEY } = process.env;

//TODO: refactor to use isValid, isLoggedIn, etc in middleware



router.get('/', async (req, res, next) => {
  try {
    const token = req.headers.authorization.split('Bearer ')[1]
    const payload = jsonwebtoken.verify(token, SECRET_KEY)
    const user = await User.findOne({ _id: payload.id }).select('-__v -password')

    if (user.admin) throw new Error('You are not authorized to access this page');

    const assignments = user.assignments;

    const status = 200
    res.json({ status, assignments })
  } catch (e) {
    console.error(e)
    const error = new Error('You are not authorized to access this route.')
    error.status = 401
    next(error)
  }
});


module.exports = router;
