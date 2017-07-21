let crypto = require('crypto');
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Q = require('q');

let schema = new Schema({
    username      : {
        type    : String,
        unique  : true,
        required: true
    },
    hashedPassword: {
        type    : String,
        required: true
    },
    salt          : {
        type    : String,
        required: true
    },
    created       : {
        type   : Date,
        default: Date.now
    }
});

schema.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._plainPassword;
    });


schema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

schema.methods.getPublicFields = function () {
    return {
        username: this.username,
        created : this.created,
        id      : this.id
    };
};

// schema.statics.authorize = function (username, password) {
//     let defer = Q.defer();
//     this.findOne({username: username}).then(
//         (user) => {
//             if (user && user.checkPassword(password)) {
//                 defer.resolve(user);
//                 // req.session.user = user._id;
//                 // res.send(user)
//             } else {
//                 let err = new Error();
//                 err.status = 403;
//                 err.message = 'no correct';
//                 defer.reject(err);
//                 // res.send('no correct')
//             }
//
//         }
//     ).catch((err) => defer.reject(err));
//     return defer.promise;
// };

exports.User = mongoose.model('User', schema);

