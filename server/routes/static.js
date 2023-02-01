const express = require('express');

const router = express.Router();
const staticPageController = require('../controllers/StaticPageController');

router.get('/:trackId', staticPageController.getAwardPage);

module.exports = router;
