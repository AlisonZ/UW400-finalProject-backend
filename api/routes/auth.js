const router = require('express').Router();
const bcrypt = require('bcrypt');

const { decodeToken, generateToken } = require('../lib/token');
const { isLoggedIn } = require('../middleware/auth');


const User = require('../models/user');

router.get('/profile', async (req, res, next) => {
  try {
    const payload = decodeToken(req.token);
    const user = await User.findOne({ _id: payload.id });

    const status = 200;
    res.json({ status, user });
  } catch (e) {
    console.error(e);
    const error = new Error('You are not authorized to access this route.');
    error.status = 401;
    next(error);
  }
})

router.post('/signup', async(req, res, next) => {

    const status = 201;

    try {
        const { email, password, firstName, lastName, admin } = req.body;

        const user = await User.findOne({email});
        if (user) throw new Error(`This email ${email} is already registered to an account`);

        const saltRounds = 10;
        const hashedPwd = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPwd,
            admin
        });

       const token = generateToken(newUser._id);

       res.json({ status, token });

    } catch(e) {
        console.error(e);
        const error = new Error('There was an error in signing up');
        error.status = 400;
        next(error)
    }
});


router.post('/login', async(req, res, next) => {
    const status = 201;
    try {
        const { email, password } = req.body;

        const user = await User.findOne({email});
        if (!user) throw new Error('There is an error with your login credentials');

        const isPwdCorrect = await bcrypt.compare(password, user.password);
        if (!isPwdCorrect) throw new Error('There is an error with your login credentials');

        const token = generateToken(user._id)

        res.json({ status, token });
    } catch(e) {
       console.error(e);
       const error = new Error('There is an error with your login credentials');
       error.status = 400;
       next(error);
    }
});

//gets all assignments for a logged in !admin
router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    const payload = decodeToken(req.token);

    const user = await User.findOne({ _id: payload.id }).select('-__v -password');

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
        const payload = decodeToken(req.token);

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


module.exports = router;
