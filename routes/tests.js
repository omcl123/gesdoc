const express = require('express');
const router = express.Router();
const VerifyToken = require('../auth/VerifyToken');
/* GET users listing. */
router.get('/',VerifyToken,function(req, res, next) {
	let jsonBlock = {};
	jsonBlock.user = req.user;
	console.log(req.user);
	res.send(jsonBlock);
});

module.exports = router;
