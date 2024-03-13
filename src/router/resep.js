const express = require("express")
const ResepController = require("../controller/resep")
const router = express.Router()
const {Protect} = require("../middleware/private")

router.get("/",ResepController.getResep)
router.get("/detail",ResepController.getResepDetail)
router.get("/:idresep",ResepController.getResepById)
router.post("/",Protect,ResepController.createResep)
router.put("/:idresep",Protect,ResepController.updateResep)
router.delete("/:idresep",Protect,ResepController.deleteResep)


module.exports = router