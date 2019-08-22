const mongoose = require('mongoose');
const config = require('../nodemon.json');
const User = require('../api/models/user');

const reset = async() => {
    mongoose.connect(config.env.MONGO_DB_CONNECTION, { useNewUrlParser: true });


    await User.deleteMany();

    return User.create([
        {
            firstName: 'Student',
            lastName: 'User',
            email: 'student@email.com',
            //TODO: change this to use bcrypt
            password: 'password',
            admin: false,
            assignments: [
                {
                   assignmentTitle: 'Assignment One',
                   assignmentLink: 'fake-url.com',
                   assignmentDescription: 'Seed data'
                }
            ]

        },
        {
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@email.com',
            //TODO: change this to use bcrypt
            password: 'password',
            admin: true,
            assignments: []
        }

    ]);
}

reset().catch(console.error).then((response) => {
    console.log(`Database has been seeded!! ${response.length} records have been created!`);
    return mongoose.disconnect();
});