const mongoose = require('mongoose');
const Assignment = require('./post');


const schema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    //change this to the encryption
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: true
    }
    assignments: [Assignment]
},{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.export = mongoose.model('User', schema);