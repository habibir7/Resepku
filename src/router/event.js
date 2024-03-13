const express = require("express")
const EventController = require("../controller/event")
const router = express.Router()
const {Protect} = require("../middleware/private")

router.get("/",EventController.getEvent)
router.post("/",Protect,EventController.createEvent)
router.delete("/:idevent",Protect,EventController.deleteEvent)


module.exports = router