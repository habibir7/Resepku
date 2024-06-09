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

const getUsersByIdModel = async (idusers) => {
	return new Promise((resolve,reject)=>
		Koneksi.query(`SELECT * FROM users WHERE idusers='${idusers}'`,(err,res)=>{
			if(!err){
				return resolve(res)
			} else {
				reject(err)
			}
		})
	)
}

const activatedUser = async (idusers) => {
	console.log(idusers)
	console.log("model - activatedUser");
	return new Promise((resolve, reject) =>
		Koneksi.query(
		`UPDATE users SET isVerify=true,verifyotp=NULL WHERE idusers='${idusers}'`,
		(err, res) => {
			if (!err) {
			return resolve(res);
			} else {
			console.log(`error db -`, err);
			reject(err);
			}
		}
		)
	);
	};

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
    let  {idusers, password, nama, email, verifyotp} = data
    return new Promise((resolve,reject) => 
        Koneksi.query(
			`INSERT INTO 
				users 
					(idusers,
					password,
					email,
					nama,
					otoritas,
					verifyOtp,
					created_at,
					edited_at)
			VALUES 
					('${idusers}',
					'${password}',
					'${email}',
					'${nama}',
					'Member',
					'${verifyotp}',
					NOW(),
					NULL)`,(err,res) => 
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
	console.log(data)
	let { nama, foto, idusers } = data
	return new Promise((resolve,reject) =>
		Koneksi.query(
	`UPDATE 
		users
	SET 
		edited_at=NOW(),
		nama='${nama}',
		foto='${foto}'
	WHERE
		idusers='${idusers}';`,(err,res)=>{
			if(!err){
				return resolve(res)
			} else {
				console.log("error db -", err);
				reject(err)
			}
		})
	)
}

const updateOtpUsersModel = async (otp, idusers) => {
	return new Promise((resolve, reject) => {
	  Koneksi.query(
		`UPDATE users SET verifyotp='${otp}',otpexp = NOW() + (15 * interval '1 minute') WHERE idusers='${idusers}'`,
		(err, res) => {
		  if (!err) {
			return resolve(res);
		  } else {
			reject(err);
		  }
		}
	  );
	});
  };

  const updatePasswordUsersModel = async (password, email) => {
	return new Promise((resolve, reject) => {
	  Koneksi.query(
		`UPDATE users SET password='${password}',otpexp=NULL,verifyotp=NULL WHERE email='${email}'`,
		(err, res) => {
		  if (!err) {
			return resolve(res);
		  } else {
			reject(err);
		  }
		}
	  );
	});
  };

const deleteUsersModel = async(idusers) => {
	return new Promise((resolve,reject) =>
	Koneksi.query(`DELETE FROM users where idusers ='${idusers}'`,(err,res) => {
		if(!err){
			return resolve(res)
		} else {
			reject(err)
		}
	})
	)
}

const verifyUsersOTP = async (email,verifyotp) => {
	return new Promise((resolve,reject)=>
		Koneksi.query(`SELECT * FROM users WHERE email='${email}' AND verifyotp='${verifyotp}'`,(err,res)=>{
			if(!err){
				return resolve(res)
			} else {
				reject(err)
			}
		})
	)
}

module.exports = {getUsersModel,createUsersModel,activatedUser,verifyUsersOTP,getUsersByIdModel,getUsersByEmailModel,updateUsersModel,deleteUsersModel,getUsersDetailModel,getUsersDetailCountModel,updateOtpUsersModel,updatePasswordUsersModel}