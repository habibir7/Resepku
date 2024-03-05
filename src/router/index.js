const express = require("express")
const router = express.Router()
const resep = require("./resep")
const users = require("./users")
const komentar = require("./komentar")

router.use("/resep",resep)
router.use("/users",users)
router.use("/komentar",komentar)

module.exports = router