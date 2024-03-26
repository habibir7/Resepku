const Koneksi = require("../config/db")

const getUsersModel = async() => {
    return new Promise((resolve,reject) => {
        Koneksi.query("SELECT * FROM users",(err,res) =>{
            if(!err){
                return resolve(res)
            }else{
                reject(err)
            }
        })
    })
}

const getUsersByUsernameModel = async (username) => {
	return new Promise((resolve,reject)=>
		Koneksi.query(`SELECT * FROM users WHERE username='${username}'`,(err,res)=>{
			if(!err){
				return resolve(res)
			} else {
				reject(err)
			}
		})
	)
}

const getUsersByEmailModel = async (username) => {
	return new Promise((resolve,reject)=>
		Koneksi.query(`SELECT * FROM users WHERE email='${username}'`,(err,res)=>{
			if(!err){
				return resolve(res)
			} else {
				reject(err)
			}
		})
	)
}

const getUsersDetailModel = async (data) => {
	let {searchBy,search,sortBy,sort,limit,offset} = data
	return new Promise((resolve,reject)=>
		Koneksi.query(`SELECT * FROM users WHERE ${searchBy} ILIKE '%${search}%' ORDER BY ${sortBy} ${sort} LIMIT ${limit} OFFSET ${offset}`,(err,res)=>{
			if(!err){
				return resolve(res)
			} else {
				reject(err)
			}
		})
	)
}
const getUsersDetailCountModel = async (data) => {
	let {searchBy,search} = data
	return new Promise((resolve,reject)=>
		Koneksi.query(`SELECT * FROM users WHERE ${searchBy} ILIKE '%${search}%'`,(err,res)=>{
			if(!err){
				return resolve(res)
			} else {
				reject(err)
			}
		})
	)
}

const createUsersModel = async(data) => {
    let  {idusers, username, password, namalengkap, surname, email, alamat} = data
    return new Promise((resolve,reject) => 
        Koneksi.query(`INSERT INTO users (idusers, username, password, namalengkap, surname, email, alamat, otoritas, created_at, edited_at) VALUES ('${idusers}','${username}', '${password}', '${namalengkap}', '${surname}', '${email}', '${alamat}', 'Member', NOW(), NULL)`,(err,res) => 
        {
            if(!err){
				return resolve(res)
			} else {
				reject(err)
			}
        })
       
    )
}

const updateUsersModel = async(data) => {
	let {username, password, namalengkap, surname, alamat, foto} = data
	return new Promise((resolve,reject) =>
		Koneksi.query(`UPDATE users SET edited_at=NOW(), password='${password}', namalengkap='${namalengkap}', surname='${surname}', alamat='${alamat}', foto='${foto}' WHERE username='${username}'`,(err,res)=>{
			if(!err){
				return resolve(res)
			} else {
				reject(err)
			}
		})
	)
}
const deleteUsersModel = async(username) => {
	return new Promise((resolve,reject) =>
	 Koneksi.query(`DELETE FROM users where username ='${username}'`,(err,res) => {
		if(!err){
			return resolve(res)
		} else {
			reject(err)
		}
	 })
	)
}

module.exports = {getUsersModel,createUsersModel,getUsersByUsernameModel,getUsersByEmailModel,updateUsersModel,deleteUsersModel,getUsersDetailModel,getUsersDetailCountModel}