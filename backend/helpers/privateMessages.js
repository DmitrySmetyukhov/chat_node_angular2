let PrivateMessages = require('../models/Message').PrivateMessage;

let pmHelper = function () {
    this.getAllMessages = function () {
        return PrivateMessages.find({})
    };

    return this;
};

exports.helper = pmHelper();