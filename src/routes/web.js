
const express = require('express')
const { getHomepage, getAbout, getMap } = require('../controllers/homeController');
const router = express.Router()

//router.Method('/route',handler)
router.get('/', getHomepage)
router.get('/about', getAbout);
router.get('/map', getMap);

module.exports = router

