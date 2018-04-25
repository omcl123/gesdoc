var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.writeHead(200);
    res.end('Hello, friend!');
});

module.exports = router;
