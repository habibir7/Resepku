const express = require("express")
const usersController = require("../controller/users")
const { Protect } = require("../middleware/private")
const router = express.Router()

router.get("/",Protect,usersController.getUsers)
router.get("/:username",usersController.getUsersByUsername)
router.post("/",usersController.createUsers)
router.put("/:username",Protect,usersController.updateUsers)
router.delete("/:username",Protect,usersController.deleteUsers)


module.exports = router