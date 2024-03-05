const Koneksi = require("../config/db")

const getKomentarModel = async() => {
    console.log("model - getKomentarModel")
    return new Promise((resolve,reject) => {
        Koneksi.query("SELECT * FROM komentar",(err,res) =>{
            if(!err){
                return resolve(res)
            }else{
                console.log("model - error Db")
                reject(err)
            }
        })
    })
}

const getKomentarByIdModel = async (idkomentar) => {
	console.log("model - getRecipeByIdModel")
	return new Promise((resolve,reject)=>
		Koneksi.query(`SELECT * FROM komentar WHERE idkomentar='${idkomentar}'`,(err,res)=>{
			if(!err){
				return resolve(res)
			} else {
				console.log(`error db -`,err)
				reject(err)
			}
		})
	)
}

const getKomentarDetailModel = async (data) => {
	let {searchBy,search,sortBy,sort,limit,offset} = data
	console.log("model - getKomentarDetailModel")
	return new Promise((resolve,reject)=>
		Koneksi.query(`SELECT * FROM komentar WHERE ${searchBy} ILIKE '%${search}%' ORDER BY ${sortBy} ${sort} LIMIT ${limit} OFFSET ${offset}`,(err,res)=>{
			if(!err){
				return resolve(res)
			} else {
				console.log(`error db -`,err)
				reject(err)
			}
		})
	)
}
const getKomentarDetailCountModel = async (data) => {
	let {searchBy,search} = data
	console.log("model - getKomentarDetailCountModel")
	return new Promise((resolve,reject)=>
		Koneksi.query(`SELECT * FROM komentar WHERE ${searchBy} ILIKE '%${search}%'`,(err,res)=>{
			if(!err){
				return resolve(res)
			} else {
				console.log(`error db -`,err)
				reject(err)
			}
		})
	)
}

const createKomentarModel = async(data) => {
    console.log("model - createKomentarModel")
    let  {idkomentar, idresep, nama, isi} = data
    console.log(data)
    return new Promise((resolve,reject) => 
        Koneksi.query(`INSERT INTO komentar (idkomentar, idresep, nama, isi, likes, isedit, created_at, edited_at) VALUES ('${idkomentar}', '${idresep}', '${nama}', '${isi}', 0, false, NOW(), NULL)`,(err,res) => 
        {
            if(!err){
                console.log("sukses")
				return resolve(res)
			} else {
				console.log(`error db -`,err)
				reject(err)
			}
        })
       
    )
}

const updateKomentarModel = async(data) => {
    console.log("model - updateKomentar")
	let {idkomentar,nama,isi} = data
	console.log(data)
	return new Promise((resolve,reject) =>
		Koneksi.query(`UPDATE komentar SET edited_at=NOW(), nama='${nama}', isi='${isi}', isedit=true WHERE idkomentar='${idkomentar}'`,(err,res)=>{
			if(!err){
				return resolve(res)
			} else {
				console.log(`error db -`,err)
				reject(err)
			}
		})
	)
}
const deleteKomentarModel = async(idkomentar) => {
	return new Promise((resolve,reject) =>
	 Koneksi.query(`DELETE FROM komentar where idkomentar ='${idkomentar}'`,(err,res) => {
		if(!err){
			return resolve(res)
		} else {
			console.log(`error db - `,err)
			reject(err)
		}
	 })
	)
}

module.exports = {getKomentarModel,createKomentarModel,getKomentarByIdModel,updateKomentarModel,deleteKomentarModel,getKomentarDetailModel,getKomentarDetailCountModel}