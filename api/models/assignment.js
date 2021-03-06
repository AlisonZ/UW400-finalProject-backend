const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    assignmentTitle: {
        type: String,
        required: true
    },
    assignmentLink: {
        type: String,
        required: true
    },
    assignmentDescription: {
        type: String,
        required: true
    },
    assignmentGrade: {
        type: Number
    }
});

module.exports = schema;

