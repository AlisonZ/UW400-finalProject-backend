const router = require('express').Router();
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');


const User = require('../models/user');
const { SECRET_KEY } = process.env;

//TODO: change this to actually be the actual view and to use authorization!
//router.get('/', async(req, res, next) => {
//    console.log('HI GETTTTT');
//});


router.post('/signup', async(req, res, next) => {

    const status = 201;

    try {
        const { email, password, firstName, lastName, admin } = req.body;

        const user = await User.findOne({email});
        if (user) throw new Error(`This email ${email} is already registered to an account`);
        //TODO: add other error handling when the front-end is connected to serve & display the errors to FE
        //TODO: email: is present and is valid (not sure what 'valid' means)
        // TODO: pwd is present and >= 8char
        //TODO: firstName is present
        //TODO: lastName is present

        const saltRounds = 10;
        const hashedPwd = await bcrypt.hash(password, saltRounds);



        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPwd,
            admin
        });

       const payload = {id: newUser._id};
       const options = { expiresIn: '1 day' };
       const token = jsonwebtoken.sign(payload, SECRET_KEY, options);

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


        const payload = {id: user._id};
        const options = { expiresIn: '1 day' };
        const token = jsonwebtoken.sign(payload, SECRET_KEY, options);

        res.json({ status, token });
    } catch(e) {
       console.error(e);
       const error = new Error('There is an error with your login credentials');
       error.status = 400;
       next(error);
    }
});


//router.get('/', async (req, res, next) => {
//  try {
//    const token = req.headers.authorization.split('Bearer ')[1]
//    const payload = jsonwebtoken.verify(token, SECRET_KEY)
//    const user = await User.findOne({ _id: payload.id }).select('-__v -password')
//
//    if (user.admin) throw new Error('You are not authorized to access this page');
//
//    const assignments = user.assignments;
//
//    const status = 200
//    res.json({ status, assignments })
//  } catch (e) {
//    console.error(e)
//    const error = new Error('You are not authorized to access this route.')
//    error.status = 401
//    next(error)
//  }
//});

router.delete('/', async (req, res, next) => {
    try {
    } catch(e) {
        console.error(e);
        const error = new Error('There was a problem deleting this assignment');
        error.status = 401;
        next(error);
    }

});

module.exports = router;
