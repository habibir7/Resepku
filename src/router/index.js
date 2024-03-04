const express = require("express")
const router = express.Router()
const resep = require("./resep")

router.use("/resep",resep)

module.exports = router