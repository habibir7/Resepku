const express = require("express")
const usersController = require("../controller/users")
const router = express.Router()

router.get("/",usersController.getUsers)
router.get("/detail",usersController.getUsersDetail)
router.get("/:username",usersController.getUsersByUsername)
router.post("/",usersController.createUsers)
router.put("/:username",usersController.updateUsers)
router.delete("/:username",usersController.deleteUsers)


module.exports = router