const express = require('express')
const usersController = require('../controller/users')
const router = express.Router()

router.post("/",usersController.login)
router.get("/activated/:idusers/:otp",usersController.verification)
router.post("/generateotp",usersController.requestOTP)
router.post("/resetpassword",usersController.resetPassword)

module.exports = router