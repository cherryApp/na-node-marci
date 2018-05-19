const express = require('express'),
      router = express.Router();

router.get('/', (req, res, next) => {
    res.render('profession', {title: 'Szakmák'});
});

module.exports = router;