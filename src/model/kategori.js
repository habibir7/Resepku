const Koneksi = require("../config/db")


const getKategoriByIdModel = async (idkategori) => {
	return new Promise((resolve,reject)=>
		Koneksi.query(`SELECT * FROM kategori WHERE idkategori='${idkategori}'`,(err,res)=>{
			if(!err){
				return resolve(res)
			} else {
				reject(err)
			}
		})
	)
}

const getKategoriModel = async() => {
    return new Promise((resolve,reject) => {
        Koneksi.query("SELECT * FROM kategori",(err,res) =>{
            if(!err){
                return resolve(res)
            }else{
                reject(err)
            }
        })
    })
}

const createKategoriModel = async(data) => {
    let  {idkategori, nama, deskripsi, foto} = data
    return new Promise((resolve,reject) => 
        Koneksi.query(`INSERT INTO kategori (idkategori, nama, deskripsi, foto) VALUES ('${idkategori}', '${nama}', '${deskripsi}', '${foto}')`,(err,res) => 
        {
            if(!err){
				return resolve(res)
			} else {
				reject(err)
			}
        })
       
    )
}

const updateKategoriModel = async(data) => {
	let {idkategori,nama,deskripsi,foto} = data
	return new Promise((resolve,reject) =>
		Koneksi.query(`UPDATE kategori SET nama='${nama}', deskripsi='${deskripsi}', foto='${foto}' WHERE idkategori='${idkategori}'`,(err,res)=>{
			if(!err){
				return resolve(res)
			} else {
				console.log(`error db -`,err)
				reject(err)
			}
		})
	)
}
const deleteKategoriModel = async(idkategori) => {
	return new Promise((resolve,reject) =>
	 Koneksi.query(`DELETE FROM kategori where idkategori ='${idkategori}'`,(err,res) => {
		if(!err){
			return resolve(res)
		} else {
			console.log(`error db - `,err)
			reject(err)
		}
	 })
	)
}

module.exports = {createKategoriModel,getKategoriModel,getKategoriByIdModel,updateKategoriModel,deleteKategoriModel}