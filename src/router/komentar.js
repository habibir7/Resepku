const express = require("express")
const KomentarController = require("../controller/komentar")
const router = express.Router()
const {Protect} = require("../middleware/private")

router.get("/",KomentarController.getKomentar)
router.get("/detail",KomentarController.getKomentarDetail)
router.get("/:idkomentar",KomentarController.getKomentarById)
router.post("/",Protect,KomentarController.createKomentar)
router.put("/:idkomentar",Protect,KomentarController.updateKomentar)
router.delete("/:idkomentar",Protect,KomentarController.deleteKomentar)


module.exports = router