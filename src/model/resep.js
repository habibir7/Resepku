const Koneksi = require("../config/db")

const getResepModel = async() => {
    return new Promise((resolve,reject) => {
        Koneksi.query("SELECT resep.idresep, resep.namaresep as Nama_resep,users.namalengkap as author,resep.komposisi,kategori.nama as Kategori,resep.foto,users.foto as fotouser FROM resep JOIN kategori ON resep.idkategori = kategori.idkategori JOIN users on resep.idusers = users.idusers",(err,res) =>{
            if(!err){
                return resolve(res)
            }else{
                reject(err)
            }
        })
    })
}

const getResepByIdModel = async (idresep) => {
	return new Promise((resolve,reject)=>
		Koneksi.query(`SELECT resep.*,users.namalengkap as author,kategori.nama as kategori FROM resep join kategori ON resep.idkategori = kategori.idkategori JOIN users on resep.idusers = users.idusers WHERE idresep='${idresep}'`,(err,res)=>{
			if(!err){
				return resolve(res)
			} else {
				reject(err)
			}
		})
	)
}

const getResepByIdUsersModel = async (idusers) => {
	return new Promise((resolve,reject)=>
		Koneksi.query(`SELECT resep.idresep, resep.namaresep, resep.komposisi,kategori.nama as Kategori,resep.foto,users.namalengkap FROM resep JOIN kategori on resep.idkategori = kategori.idkategori JOIN users ON resep.idusers = users.idusers WHERE resep.idusers='${idusers}'`,(err,res)=>{
			if(!err){
				return resolve(res)
			} else {
				reject(err)
			}
		})
	)
}

const getResepDetailModel = async (data) => {
	let {searchBy,search,sortBy,sort,limit,offset} = data
	return new Promise((resolve,reject)=>
		Koneksi.query(`SELECT * FROM resep WHERE ${searchBy} ILIKE '%${search}%' ORDER BY ${sortBy} ${sort} LIMIT ${limit} OFFSET ${offset}`,(err,res)=>{
			if(!err){
				return resolve(res)
			} else {
				reject(err)
			}
		})
	)
}
const getResepDetailCountModel = async (data) => {
	let {searchBy,search} = data
	return new Promise((resolve,reject)=>
		Koneksi.query(`SELECT * FROM resep WHERE ${searchBy} ILIKE '%${search}%'`,(err,res)=>{
			if(!err){
				return resolve(res)
			} else {
				reject(err)
			}
		})
	)
}

const createResepModel = async(data) => {
    let  {idresep, namaresep, idusers, komposisi, idkategori, foto} = data
    return new Promise((resolve,reject) => 
        Koneksi.query(`INSERT INTO resep (idresep, namaresep, idusers, komposisi, idkategori, foto, created_at, edited_at) VALUES ('${idresep}', '${namaresep}', '${idusers}', '${komposisi}', '${idkategori}', '${foto}', NOW(), NULL)`,(err,res) => 
        {
            if(!err){
				return resolve(res)
			} else {
				console.log(err)
				reject(err)
			}
        })
       
    )
}

const updateResepModel = async(data) => {
    console.log("model - updateResep")
	let {idresep,namaresep,komposisi,idkategori,foto} = data
	return new Promise((resolve,reject) =>
		Koneksi.query(`UPDATE resep SET edited_at=NOW(), namaresep='${namaresep}', komposisi='${komposisi}', idkategori='${idkategori}', foto='${foto}' WHERE idresep='${idresep}'`,(err,res)=>{
			if(!err){
				return resolve(res)
			} else {
				console.log(`error db -`,err)
				reject(err)
			}
		})
	)
}
const deleteResepModel = async(idresep) => {
	return new Promise((resolve,reject) =>
	 Koneksi.query(`DELETE FROM resep where idresep ='${idresep}'`,(err,res) => {
		if(!err){
			return resolve(res)
		} else {
			console.log(`error db - `,err)
			reject(err)
		}
	 })
	)
}

module.exports = {getResepModel,createResepModel,getResepByIdModel,getResepByIdUsersModel,updateResepModel,deleteResepModel,getResepDetailModel,getResepDetailCountModel}