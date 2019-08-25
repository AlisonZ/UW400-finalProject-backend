const router = require('express').Router();
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const User = require('../models/user');
const { SECRET_KEY } = process.env;


router.post('/new', async(req, res, next) => {
    try {
        const token = req.headers.authorization.split('Bearer ')[1];
        const payload = jsonwebtoken.verify(token, SECRET_KEY);

        const user = await User.findOne({ _id: payload.id });

        user.assignments.push(req.body);

        await user.save();

        const newAssignment = user.assignments[user.assignments.length -1];
        
        const status = 201;
        res.json({ status, newAssignment});

  } catch (e) {
      console.error(e)
      const error = new Error('You are not authorized to access this route.')
      error.status = 401
      next(error)
    }
});



module.exports = router;
