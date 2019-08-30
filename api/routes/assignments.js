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

router.get('/:assignId/edit', async(req, res, next) => {
    try {
        const { assignId } = req.params;

        const token = req.headers.authorization.split('Bearer ')[1];
        const payload = jsonwebtoken.verify(token, SECRET_KEY);

        const user = await User.findOne({ _id: payload.id });


        const assignment = user.assignments.id(assignId);

        const status = 200;
        res.json({ status, response: assignment });

    } catch(e) {
        console.error(e);
        const error = new Error('There was a problem updating your assignment');
        error.status = 401;
        next(error);
    }
});

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

router.get('/ungraded', async(req, res, next) => {
    try {
        const token = req.headers.authorization.split('Bearer ')[1];
        const payload = jsonwebtoken.verify(token, SECRET_KEY);

        const user = await User.findOne({ _id: payload.id });
        const allUsers = await User.find({});

        const ungradedAssignments = [];

        if(user.admin) {
            allUsers.map((user) => {
            //I know that this is On^2, but it is the only solution
            //I could think of with the way that the databases and relationships are constructed right now
                user.assignments.map((assignment) => {
                    if(!assignment.assignmentGrade) {
                        ungradedAssignments.push(
                            {
                                firstName: user.firstName,
                                lastName: user.lastName,
                                assignmentTitle: assignment.assignmentTitle,
                                assignmentLink: assignment.assignmentLink,
                            }
                        );
                    }
                });
            });
        }

        const status = 200;
        res.json({ status, ungradedAssignments });

    } catch(e) {
        console.error(e);
        const error = new Error('There was a problem updating your assignment');
        error.status = 401;
        next(error);
    }
});

router.get('/graded', async(req, res, next) => {
    try {
        const token = req.headers.authorization.split('Bearer ')[1];
        const payload = jsonwebtoken.verify(token, SECRET_KEY);

        const user = await User.findOne({ _id: payload.id });
        const allUsers = await User.find({});

        const gradedAssignments = [];

        if(user.admin) {
            allUsers.map((user) => {
                if(!user.admin) {
                //I know that this is On^2, but it is the only solution
                //I could think of with the way that the databases and relationships are constructed right now
                    user.assignments.map((assignment) => {
                        if(assignment.assignmentGrade) {
                            gradedAssignments.push(
                                {
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    assignmentTitle: assignment.assignmentTitle,
                                    assignmentLink: assignment.assignmentLink,
                                    assignmentGrade: assignment.assignmentGrade
                                }
                            );
                        }
                    });
                }
            });
        }

        const status = 200;
        res.json({ status, gradedAssignments });

    } catch(e) {
        console.error(e);
        const error = new Error('There was a problem updating your assignment');
        error.status = 401;
        next(error);
    }
});


//This route does not work and I do not have time to discern why
//something to do with the :assignId getting passed in as the param
router.delete('/', async (req, res, next) => {

  const status = 200


  const token = req.headers.authorization.split('Bearer ')[1];
  const payload = jsonwebtoken.verify(token, SECRET_KEY);

  const { assignId } = req.params

  const user = await User.findOne({ _id: payload.id });

  let updatedAssignList = [];

    //could not get filter working correctly so did this sub-optimal solution
  user.assignments.map ((assign) => {
  if(assignId !== assign._id.toString()) {
    updatedAssignList.push(assign);
  }

  })

   user.assignments = updatedAssignList;
  await user.save()

  res.json({ status, response: user })
})
module.exports = router;
