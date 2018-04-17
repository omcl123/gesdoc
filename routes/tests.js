var express = require('express');
var router = express.Router();
var testController = require("../controller/tests");
/* GET users listing. */
router.get('/', async function(req, res, next) {
	let jsonBlock = await testController.devuelveTabla();
	res.send(jsonBlock);
});

module.exports = router;
