const express = require('express'),
      router = express.Router(),
      DB = require('../module/DB'),
      Users = new DB('users'),
      Auth = require('../module/auth');

router.get('/', (req, res, next) => {
    res.render('login', {title: 'Belépés'});
});

/**
 * Post bejelentkezés kezelése.
 */
router.post('/', (req, res, next) => {
    Users.findOne({email: req.body.email, password: req.body.password})
        .then( user => {
            if (user) {
                delete user.password;
                Auth.setCookie(req, res, user);
                res.send('Sikeres belépés');
            } else {
                res.render('login', {title: 'Belépés', fail: true});
            }
        })
        .catch( err => {
            console.error(err);
            res.render('login', {title: 'Belépés'});
        });
});

module.exports = router;
