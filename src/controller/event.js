const {v4: uuidv4} = require("uuid")
const {
    createEventModel,
    getEventByIdModel,
    getEventModel,
    deleteEventModel
} = require("../model/event")
const { search } = require("../router");
const { Protect } = require("../middleware/private")


const EventController = {
        createEvent: async (req,res,next) => {
        try {
            let { eventname,idresep } = req.body
            if(
                !eventname ||
                eventname === "" ||
                !idresep ||
                idresep === "" 
            ){
                return res.json({code: 404,message: "Harap masukkan Event Dengan lengkap"})
            }
            let idusers = req.payload.idusers
            let data = {idevent: uuidv4(), eventname, idusers, idresep}
            let result = await createEventModel(data)
            if(result.rowCount === 1){
                return res
                .status(201)
                .json({ code:201, message: "Data berhasil Di input"})
            }
            return res
            .status(401)
            .json({ code: 401, message: "Maaf data tidak berhasil Di input"})
        } catch (err){
            return res
            .status(404)
            .json({ code: 404, message: "CreateEvent Controller Error"})
        }
    }, 
        getEvent: async (req,res,next) => {
        try{
            let resep = await getEventModel()
            let result = resep.rows
            return res.status(200).json({message:"sukses getEvent ",data:result})
        }catch(err){
            return res.status(404).json({message:"gagal getEvent controller"})
        }
    },
        deleteEvent: async (req,res,next) => {
        try{
            let { idevent } = req.params;
            if (idevent === "") {
                return res.status(404).json({ message: "params id invalid" });
            }
            let event = await getEventByIdModel(idevent);
            let resultEvent = event.rows;
            if (!resultEvent.length) {
                return res
                    .status(404)
                    .json({ message: "event not found or id invalid" });
            }
            let Event = resultEvent[0].rows
            if(Event.idusers !== req.payload.idusers){
                return res
                    .status(404)
                    .json({ message: "event not found or id invalid" });
            }
            let result = await deleteEventModel(idevent)
            if (!result.length) {
                return res
                    .status(201)
                    .json({ code: 201, message: "success Delete data" });
            }
            return res.status(200).json({code:401,message:"failed Delete data"})

        }catch(err){
            return res
            .status(404)
            .json({ code: 404, message: "Delete event Controller Error"})
        }
    }
}

module.exports = EventController