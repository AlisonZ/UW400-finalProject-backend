const { MONGO_DB_CONNECTION } = process.env;
const mongoose = require('mongoose');


const connectToDb = () => {
    const errorMsg = 'There is no MONGODB connection';

    try {
        if(!MONGO_DB_CONNECTION) { throw errorMsg }

        const options = { useNewUrlParser: true, useFindAndModify: true };
        mongoose.connect(MONGO_DB_CONNECTION, options).catch(err => console.log(err));
        console.log('Connected to database');
    } catch(e) {
        console.log(e.message)
    }
}

module.exports = connectToDb;