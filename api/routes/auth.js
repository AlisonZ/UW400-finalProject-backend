const router = require('express').Router();
const bcrypt = require('bcrypt');


const User = require('../models/user');


//TODO: change this to actually be the Student View
router.get('/', async(req, res, next) => {
    console.log('HI GETTTTT');
});


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

        res.json({ status, newUser });

    } catch(e) {
        console.error(e);
        const error = new Error('There was an error in signing up');
        error.status = 400;
        next(error)
    }
});

module.exports = router;
