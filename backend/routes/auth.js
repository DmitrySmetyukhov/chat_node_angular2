var express = require('express');
var router = express.Router();
var User = require('../models/user').User;
// var ObjectId = require('mongodb').ObjectID;

function notFound() {
    var err = new Error();
    err.status = 404;
    err.message = 'User not found';
    return err;
}

/* GET home page. */
router.post('/login', function (req, res, next) {
    // try {
    //     var id = new ObjectId(req.body.login);
    // } catch (e) {
    //     return next(notFound());
    // }

    User.findOne({username: req.body.login}).then(
        (user) => {
            if (!user) {
                return next(notFound());
            }
            if (!user.checkPassword(req.body.password)) {
                var err = new Error();
                err.status = 403;
                err.message = 'No correct password.';
                return next(err);
            }

            req.session.userId = user._id;
            res.json(user);
        }
    )
});

router.post('/logout', function (req, res, next) {
    req.session.destroy((err) => {
        if(err) return next(err);
        res.send();
    });
});

module.exports = router;
