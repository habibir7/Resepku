const express = require("express")
const KategoriController = require("../controller/kategori")
const router = express.Router()
const {Protect} = require("../middleware/private")

router.get("/",KategoriController.getKategori)
router.post("/",Protect,KategoriController.createKategori)
router.put("/:idkategori",Protect,KategoriController.updateKategori)
router.delete("/:idkategori",Protect,KategoriController.deleteKategori)


module.exports = router