const mongoose = require('mongoose');

const exitResponseSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    responses: [{
        questionText: String,
        response: String
    }]
});

module.exports = mongoose.model('ExitResponse', exitResponseSchema);
