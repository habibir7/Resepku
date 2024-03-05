const Koneksi = require("../config/db")

const getResepModel = async() => {
    return new Promise((resolve,reject) => {
        Koneksi.query("SELECT * FROM resep",(err,res) =>{
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
		Koneksi.query(`SELECT * FROM resep WHERE idresep='${idresep}'`,(err,res)=>{
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
    let  {idresep, namaresep, author, komposisi, kategori, foto} = data
    return new Promise((resolve,reject) => 
        Koneksi.query(`INSERT INTO resep (idresep, namaresep, author, komposisi, kategori, foto, jumlahpenggemar, dibuatpada, dieditpada) VALUES ('${idresep}', '${namaresep}', '${author}', '${komposisi}', '${kategori}', '${foto}', 0, NOW(), NULL)`,(err,res) => 
        {
            if(!err){
				return resolve(res)
			} else {
				reject(err)
			}
        })
       
    )
}

const updateResepModel = async(data) => {
    console.log("model - updateResep")
	let {idresep,namaresep,author,komposisi,kategori,foto} = data
	return new Promise((resolve,reject) =>
		Koneksi.query(`UPDATE resep SET dieditpada=NOW(), namaresep='${namaresep}', author='${author}', komposisi='${komposisi}', kategori='${kategori}', foto='${foto}' WHERE idresep='${idresep}'`,(err,res)=>{
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

module.exports = {getResepModel,createResepModel,getResepByIdModel,updateResepModel,deleteResepModel,getResepDetailModel,getResepDetailCountModel}