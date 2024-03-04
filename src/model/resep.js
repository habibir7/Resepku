const Koneksi = require("../config/db")

const getResepModel = async() => {
    console.log("model - getResepModel")
    return new Promise((resolve,reject) => {
        Koneksi.query("SELECT * FROM resep",(err,res) =>{
            if(!err){
                return resolve(res)
            }else{
                console.log("model - error Db")
                reject(err)
            }
        })
    })
}

const getResepByIdModel = async (idresep) => {
	console.log("model - getRecipeByIdModel")
	return new Promise((resolve,reject)=>
		Koneksi.query(`SELECT * FROM resep WHERE idresep='${idresep}'`,(err,res)=>{
			if(!err){
				return resolve(res)
			} else {
				console.log(`error db -`,err)
				reject(err)
			}
		})
	)
}

const createResepModel = async(data) => {
    console.log("model - createResepModel")
    let  {idresep, namaresep, author, komposisi, kategori, foto} = data
    console.log(data)
    return new Promise((resolve,reject) => 
        Koneksi.query(`INSERT INTO resep (idresep, namaresep, author, komposisi, kategori, foto, jumlahpenggemar, dibuatpada, dieditpada) VALUES ('${idresep}', '${namaresep}', '${author}', '${komposisi}', '${kategori}', '${foto}', 0, NOW(), NULL)`,(err,res) => 
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

const updateResepModel = async(data) => {
    console.log("model - updateResep")
	let {idresep,namaresep,author,komposisi,kategori,foto} = data
	console.log(data)
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

module.exports = {getResepModel,createResepModel,getResepByIdModel,updateResepModel,deleteResepModel}