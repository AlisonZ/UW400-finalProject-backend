const router = require('express').Router();
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const User = require('../models/user');
const { SECRET_KEY } = process.env;

//TODO: refactor to use isValid, isLoggedIn, etc in middleware


//gets all assignments for a logged in !admin
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

//delete an assignment for a logged in !admin
router.delete('/:assignId', async (req, res, next) => {
    try {
        const token = req.headers.authorization.split('Bearer ')[1];
        const payload = jsonwebtoken.verify(token, SECRET_KEY);

        const user = await User.findOne({ _id: payload.id });


        user.assignments = user.assignments.filter(assignment => assignment._id.toString() !== req.params.assignId);

        await user.save();

        const status = 200;
        res.json({ status, user })

    } catch(e) {
        console.error(e);
        const error = new Error('There was a problem deleting this assignment');
        error.status = 401;
        next(error);
    }

});

//edit an assignment --> should be moved to assignments.js
//TODO: figure out how to better pass these down as params; this doesn't seem correct
router.put('/:assignId/:userId', async(req, res, next) => {

    try {
    const { assignId, userId } = req.params;

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
