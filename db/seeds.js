const mongoose = require('mongoose');
const config = require('../nodemon.json');
const bcrypt = require('bcrypt');


const User = require('../api/models/user');

const reset = async() => {
    mongoose.connect(config.env.MONGO_DB_CONNECTION, { useNewUrlParser: true });


    await User.deleteMany();

    return User.create([
        {
            firstName: 'Student',
            lastName: 'User',
            email: 'student@email.com',
            password: bcrypt.hashSync('password', 10),
            admin: false,
            assignments: [
                {
                   assignmentTitle: 'Assignment One',
                   assignmentLink: 'fake-url.com',
                   assignmentDescription: 'Seed data',
                   assignmentGrade: 95
                },
                {
                    assignmentTitle: 'Assignment Two',
                    assignmentLink: 'fake-url.com',
                    assignmentDescription: 'Seed data two',
                    assignmentGrade: 85
                 }
            ]

        },
        {
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@email.com',
            password: bcrypt.hashSync('password', 10),
            admin: true,
            assignments: []
        }

    ]);
}

reset().catch(console.error).then((response) => {
    console.log(`Database has been seeded!! ${response.length} records have been created!`);
    return mongoose.disconnect();
});