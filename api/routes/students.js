const router = require('express').Router();
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const User = require('../models/user');
const { SECRET_KEY } = process.env;

//gets list of students for admin and !admin
router.get('/', async(req, res, next) => {
    try {
        const token = req.headers.authorization.split('Bearer ')[1];
        const payload = jsonwebtoken.verify(token, SECRET_KEY);

        //get current user
        const currentUser = await User.findOne({ _id: payload.id });

        //get all users
        const users = await User.find({});

        const studentList = [];

        //determine what info to return based on admin privileges
        if(!currentUser.admin) {
            users.map((user) => {
                if(!user.admin) {
                    studentList.push({
                        "firstName": user.firstName,
                        "lastName": user.lastName,
                        "email": user.email
                    });
                }
            });
        } else {
            users.map((user) => {
                if(!user.admin) {
                const assignGrade = user.assignments.assignmentGrade ? user.assignments.assignmentGrade : 'TBD';
                console.log('user', assignGrade)
                   studentList.push({
                    "firstName": user.firstName,
                    "lastName": user.lastName,
                    "email": user.email,
                    "assignmentGrade": assignGrade

                  });

                }
            });
        }

        const status = 200;
        res.json({ status, studentList });
    } catch(e) {
        console.error(e);
        const error = new Error('You do not have permissions to see this list');
        error.status = 401;
        next(error);
    }
});

module.exports = router;
