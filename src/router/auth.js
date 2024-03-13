const express = require('express')
const usersController = require('../controller/users')
const router = express.Router()

router.post("/",usersController.login)

module.exports = router