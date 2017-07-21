var express = require('express');
var router = express.Router();
var User = require('../models/user').User;
var ObjectId = require('mongodb').ObjectID;

function notFound(){
    var err = new Error();
    err.status = 404;
    err.message = 'User not found';
    return err;
}

/* GET users listing. */
router.get('/', function (req, res, next) {
    User.find({}).then(
        (users) => res.json(users)
    ).catch((err) => next(err));
});

router.get('/:id', function (req, res, next) {
    try {
        var id = new ObjectId(req.params.id);
    } catch (e) {
        return next(notFound());
    }

    User.findById(id).then(
        (user) => {
            if(!user){
                return next(notFound());
            }
            req.session.lastUser = user._id;
            res.send(user);
        }
    ).catch((err) => next(err))
});




module.exports = router;
