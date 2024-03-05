const express = require("express")
const KomentarController = require("../controller/komentar")
const router = express.Router()

router.get("/",KomentarController.getKomentar)
router.get("/detail",KomentarController.getKomentarDetail)
router.get("/:idkomentar",KomentarController.getKomentarById)
router.post("/",KomentarController.createKomentar)
router.put("/:idkomentar",KomentarController.updateKomentar)
router.delete("/:idkomentar",KomentarController.deleteKomentar)


module.exports = router