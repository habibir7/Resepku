const express = require("express")
const ResepController = require("../controller/resep")
const router = express.Router()
const {Protect} = require("../middleware/private")
const upload =  require("../middleware/foto")

router.get("/",ResepController.getResep)
router.get("/detail",ResepController.getResepDetail)
router.get("/:idresep",ResepController.getResepById)
router.post("/",Protect,upload.single("foto"),ResepController.createResep)
router.put("/:idresep",Protect,upload.single("foto"),ResepController.updateResep)
router.delete("/:idresep",Protect,ResepController.deleteResep)


module.exports = router