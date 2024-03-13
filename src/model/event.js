const Koneksi = require("../config/db")


const getEventModel = async() => {
    return new Promise((resolve,reject) => {
        Koneksi.query("SELECT * FROM event",(err,res) =>{
            if(!err){
                return resolve(res)
            }else{
                reject(err)
            }
        })
    })
}

const getEventByIdModel = async (idevent) => {
	return new Promise((resolve,reject)=>
		Koneksi.query(`SELECT * FROM event WHERE idevent='${idevent}'`,(err,res)=>{
			if(!err){
				return resolve(res)
			} else {
				reject(err)
			}
		})
	)
}

const createEventModel = async(data) => {
    let  {idevent, eventname, idusers, idresep} = data
    return new Promise((resolve,reject) => 
        Koneksi.query(`INSERT INTO event (idevent, eventname, idusers, idresep, event_time) VALUES ('${idevent}', '${eventname}', '${idusers}', '${idresep}', NOW())`,(err,res) => 
        {
            if(!err){
				return resolve(res)
			} else {
				reject(err)
			}
        })
       
    )
}

const deleteEventModel = async(idevent) => {
	return new Promise((resolve,reject) =>
	 Koneksi.query(`DELETE FROM event where idevent ='${idevent}'`,(err,res) => {
		if(!err){
			return resolve(res)
		} else {
			console.log(`error db - `,err)
			reject(err)
		}
	 })
	)
}

module.exports = {createEventModel,getEventModel,getEventByIdModel,deleteEventModel}