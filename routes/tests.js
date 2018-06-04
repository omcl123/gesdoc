const express = require('express');
const multer = require('multer');
const router = express.Router();
const VerifyToken = require('../auth/VerifyToken');

const UPLOAD_PATH = '/home/inf245/files/test/';
const upload = multer({ dest: `${UPLOAD_PATH}/` });
const type = upload.single('file');
/* GET users listing. */
router.get('/',VerifyToken,function(req, res, next) {
	let jsonBlock = {};
	jsonBlock.user = req.body.verifiedUser;
	console.log(req.user);
	res.send(jsonBlock);
});

router.post('/upload', type, async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.file);

        res.send(req.file);
    } catch (err) {
        res.sendStatus(400);
    }
});

router.get('/download', async (req, res) => {
    try {
        res.setHeader('Content-Type', 'image/jpeg');
        fs.createReadStream(path.join(UPLOAD_PATH, '216252d31e8692b818b76f990628acca')).pipe(res);
    } catch (err) {
        res.sendStatus(400);
    }
});

module.exports = router;
