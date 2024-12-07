const express = require('express');
const router = express.Router();
const { hideMessage, showMessage } = require('../controllers/hideMessageController');

router.post('/hide', hideMessage);
router.post('/show', showMessage);

module.exports = router;
