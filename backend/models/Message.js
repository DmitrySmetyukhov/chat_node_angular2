let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
    text: {
        type    : String,
        unique  : false,
        required: true
    },

    sender: {
        type    : String,
        required: true
    },

    receiver: {
        type    : String,
        required: true
    },

    created: {
        type   : Date,
        default: Date.now
    }
});

exports.Message = mongoose.model('Message', schema);

