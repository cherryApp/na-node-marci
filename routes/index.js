const express = require('express');
const router = express.Router();
const DB = require('../module/DB');
const professions = new DB('professions');

/* GET home page. */
router.get('/', function(req, res, next) {
  professions.getAll()
    .then( profs => {
      console.log(profs);
      res.render('index', { title: 'Della', profs: profs });
    });


});

module.exports = router;
