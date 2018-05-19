const express = require('express'),
      router = express.Router(),
      Auth = require('../module/auth');

router.get('/', (req, res, next) => {
    Auth.logout(req, res).redirect('/');
});

module.exports = router;
