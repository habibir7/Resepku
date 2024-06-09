const express = require("express")
const usersController = require("../controller/users")
const { Protect } = require("../middleware/private")
const router = express.Router()
const upload =  require("../middleware/foto")

router.get("/",Protect,usersController.getUsers)
router.post("/",usersController.createUsers)
router.put("/",Protect,upload.single("foto"),usersController.updateUsers)
router.delete("/:username",Protect,usersController.deleteUsers)


module.exports = router