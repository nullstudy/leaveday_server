// var express = require('express');
// var router = express.Router();

/* GET users listing. */


// module.exports = router;

const user = require('../controllers/user');

module.exports = function(app) {
    app.get('/', user.userIndex);

}