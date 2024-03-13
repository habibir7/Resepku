const express = require("express")
const router = express.Router()
const resep = require("./resep")
const users = require("./users")
const komentar = require("./komentar")
const kategori = require("./kategori")
const event = require("./event")
const auth = require("./auth")


router.use("/auth",auth)
router.use("/resep",resep)
router.use("/kategori",kategori)
router.use("/event",event)
router.use("/users",users)
router.use("/komentar",komentar)

module.exports = router