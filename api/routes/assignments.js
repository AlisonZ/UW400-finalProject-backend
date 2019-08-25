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

///edit an assignment --> should be moved to assignments.js
//TODO: figure out how to better pass these down as params; this doesn't seem correct
router.put('/:assignId/edit', async(req, res, next) => {
    try {
    const { assignId } = req.params;

    const token = req.headers.authorization.split('Bearer ')[1];
    const payload = jsonwebtoken.verify(token, SECRET_KEY);

    const user = await User.findOne({ _id: payload.id });

    const assignment = user.assignments.id(assignId);
    const { assignmentTitle, assignmentLink, assignmentDescription } = req.body;

    assignment.assignmentTitle = assignmentTitle;
    assignment.assignmentLink = assignmentLink;
    assignment.assignmentDescription = assignmentDescription;

    await user.save();

    const status = 200;

    res.json({ status, response: assignment });
    }
    catch(e) {
        console.error(e);
        const error = new Error('There was a problem updating your assignment');
        error.status = 401;
        next(error);
    }
});



module.exports = router;
