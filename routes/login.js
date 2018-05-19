const express = require('express'),
      router = express.Router();

router.get('/', (req, res, next) => {
    res.render('login', {title: 'Belépés'});
});

module.exports = router;
