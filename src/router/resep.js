const express = require("express")
const ResepController = require("../controller/resep")
const router = express.Router()

router.get("/",ResepController.getResep)
router.get("/detail",ResepController.getResepDetail)
router.get("/:idresep",ResepController.getResepById)
router.post("/",ResepController.createResep)
router.put("/:idresep",ResepController.updateResep)
router.delete("/:idresep",ResepController.deleteResep)


module.exports = router