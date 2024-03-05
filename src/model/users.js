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
    let  {username, password, namalengkap, surname, email, alamat} = data
    return new Promise((resolve,reject) => 
        Koneksi.query(`INSERT INTO users (username, password, namalengkap, surname, email, alamat, created_at, edited_at) VALUES ('${username}', '${password}', '${namalengkap}', '${surname}', '${email}', '${alamat}', NOW(), NULL)`,(err,res) => 
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
	let {username, password, namalengkap, surname, email, alamat} = data
	return new Promise((resolve,reject) =>
		Koneksi.query(`UPDATE users SET edited_at=NOW(), password='${password}', namalengkap='${namalengkap}', surname='${surname}', email='${email}', alamat='${alamat}' WHERE username='${username}'`,(err,res)=>{
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

module.exports = {getUsersModel,createUsersModel,getUsersByUsernameModel,updateUsersModel,deleteUsersModel,getUsersDetailModel,getUsersDetailCountModel}