const {v4: uuidv4} = require("uuid")
const argon2 = require("argon2")
const {GenerateToken} = require("../helper/token")
const {
    activatedUser,
    getUsersModel,
    getUsersByIdModel,
    getUsersByEmailModel,
    getUsersDetailCountModel,
    getUsersDetailModel,
    createUsersModel,
    updateUsersModel,
    updateOtpUsersModel,
    updatePasswordUsersModel,
    deleteUsersModel,
    verifyUsersOTP
} = require("../model/users")
const {
    sendEmailActivated,
    sendEmailActivatedotp,
    } = require("../helper/email");
const { search } = require("../router");
const { Protect } = require("../middleware/private")
const cloudinary = require("../config/foto")


const UsersController = {
    login: async (req, res, next) => {
		let { email, password } = req.body;
        if (!email || !password || password == "" || email == "") {
            return res
                .status(401)
                .json({
                    status: 401,
                    messages: "Email & password is required",
                });
        }
        let user = await getUsersByEmailModel(email);
        if (user.rowCount === 0) {
            return res
			.status(401)
			.json({ status: 401, messages: "email not register" });
        }
		let userData = user.rows[0]
		
		let isVerify = await argon2.verify(userData.password,password)
        if (!isVerify) {
			return res
			.status(401)
			.json({ status: 401, messages: "password wrong" });
        }
		

        if(userData.isVerify === false){
            return res
			.status(401)
			.json({ status: 401, messages: "Account not verified, Please check your email !" });
        }
		delete userData.password
		let token = GenerateToken(userData)
		
		return res.status(201).json({ status: 201, messages: "login success",token,userData });
	},
    getUsersDetail: async (req, res, next) => {
        try {
			let searchBy
			if(req.query.searchBy === ""){
				if(req.query.searchBy === "nama"){
					searchBy = req.query.searchBy
				} else {
					searchBy = "nama"
				}
			} else{
				searchBy = "nama"
			}
            console.log(req.query.searchBy)
			let sortBy
			if(req.query.sortBy === ""){
				if(req.query.sortBy === "created_at" ||  req.query.sortBy === "edited_at"){
					sortBy = req.query.sortBy
				} else {
					sortBy = "created_at"
				}
			} else{
				sortBy = "created_at"
			}
			let sort
			if(req.query.sort === ""){
				if(req.query.sort === "ASC" ||  req.query.sort === "DESC"){
					sort = req.query.sort
				} else {
					sort = "ASC"
				}
			} else{
				sort = "ASC"
			}
			let search = req.query.search || ""
			let limit = req.query.limit || 3
			let offset = ((req.query.page || 1) - 1) * parseInt(limit)

            console.log(search)

			let data = {searchBy,search,sortBy,sort,limit,offset}

            let users = await getUsersDetailModel(data);
            let count = await getUsersDetailCountModel(data);
			let total = count.rowCount
            let result = users.rows;
			let page_next
			if(req.query.page == Math.round(total/parseInt(limit))){
				page_next = 0
			} else {
				page_next = parseInt(req.query.page) + 1
			}
			
			let pagination = {
				page_total : Math.round(total/parseInt(limit)),
				page_prev: parseInt(req.query.page) - 1,
				page_next,
				total_data : total
			}
            
            return res
                .status(200)
                .json({ message: "success getUsersDetail", data: result ,pagination});
        } catch (err) {
            console.log("getUsers error");
            console.log(err);
            return res
                .status(404)
                .json({ message: "failed getUsersDetail Controller" });
        }
    },
    getUsers: async (req,res,next) => {
        try{
            if(req.payload.otoritas == "Member"){
                let users = await getUsersByIdModel(req.payload.idusers)
                let result = users.rows
                return res.status(200).json({message:"sukses getUsersById",data:result})
            }
            let users = await getUsersModel()
            let result = users.rows
            return res.status(200).json({message:"sukses getUsers",data:result})
        }catch(err){
            console.log("users controller error")
            console.log(err)
            return res.status(404).json({message:"gagal getUsers controller"})
        }
    },
    createUsers: async (req,res,next) => {
        try {
            let { email,password,nama } = req.body
            console.log(email,password,nama)
            if(
                !password ||
                password === "" ||
                !nama ||
                nama === "" ||
                !email ||
                email === ""
            ){
                return res.status(401).json({code: 401,message: "Harap masukkan data dengan lengkap"})
            }
            cek = await getUsersByEmailModel(email)
            if(cek.rowCount === 1){
                return res.status(404).json({code: 404,message: "Email sudah Terdaftar"})
            }
            password = await argon2.hash(password)
            let data = {idusers: uuidv4(), email, password, nama, verifyotp: uuidv4()}
            let result = await createUsersModel(data)
            if(result.rowCount === 1){
                let url = `https://resepku-rouge.vercel.app/auth/activated/${data.idusers}/${data.verifyotp}`;
    
                let sendOTP = await sendEmailActivated(email, url, nama);
    
                if (!sendOTP) {
                    return res
                    .status(401)
                    .json({ status: 401, messages: "Register failed when send email" });
                }
                return res
                .status(201)
                .json({ code:201, message: "Data berhasil Di input"})
            }
            return res
            .status(401)
            .json({ code: 401, message: "Maaf data tidak berhasil Di input"})
        } catch (err){
            console.log("CreateUsers Error")
            console.log(err)
            return res
            .status(404)
            .json({ code: 404, message: "CreateUsers Controller Error"})
        }
    }, 
    updateUsers: async (req, res, next) => {
        try {
            let idusers = req.payload.idusers
            let { nama } = req.body;
            let users = await getUsersByIdModel(idusers);
            let resultUsers = users.rows;
            let Users = resultUsers[0];
            let data = {
                idusers: idusers,
                nama: nama || Users.nama,
            };

            if(!req.file){
                data.foto = Users.foto
                let result = await updateUsersModel(data);
                if (result.rowCount === 1) {
                    return res
                        .status(201)
                        .json({ code: 201, message: "success update data" });
                }
            }else if(req.file){
                if(!req.isFileValid){
                    return res.json({
                        code: 404,
                        message: req.isFileValidMessage,})
                }

                const imageUpload = await cloudinary.uploader.upload(
                    req.file.path,
                    {
                        folder: "Resepku",
                    }
                )
                if (!imageUpload) {
                    return res.json({ code: 404, message: "upload foto failed" });
                }
                data.foto = imageUpload.secure_url
                console.log(data.foto)
                let result = await updateUsersModel(data);
                if (result.rowCount === 1) {
                    return res
                        .status(201)
                        .json({ code: 201, message: "success update data" });
                }
            }
            
            return res.status(401).json({code:401,message:"failed update data"})
        } catch (err) {
            return res
                .status(404)
                .json({ message: "failed InputResep Controller" });
        }
    },
    
    deleteUsers: async (req,res,next) => {
        try{
            let { idusers } = req.params;
            if (idusers === "") {
                return res.status(404).json({ message: "params username invalid" });
            }
            if (req.payload.otoritas !== "Admin" && idusers !== req.payload.idusers) {
                return res.status(403).json({ message: "You are not allowed to edit another user's data" });
            }
            let users = await getUsersByIdModel(idusers);
            let resultUsers = users.rows;
            if (!resultUsers.length) {
                return res
                    .status(404)
                    .json({ message: "data not found or username invalid" });
            }
            let result = await deleteUsersModel(idusers)
            if (!result.length) {
                return res
                    .status(201)
                    .json({ code: 201, message: "success Delete data" });
            }
            return res.status(200).json({code:401,message:"failed Delete data"})

        }catch(err){
            console.log("deleteUsers Error")
            console.log(err)
            return res
            .status(404)
            .json({ code: 404, message: "Deleteusers Controller Error"})
        }
    },
    verification: async (req, res, next) => {
        let { idusers, otp } = req.params;
    
        let user = await getUsersByIdModel(idusers);
        if (user.rowCount === 0) {
            return res
            .status(404)
            .json({ status: 404, messages: "Email not register" });
        }
        let userData = user.rows[0];
    
        if (otp !== userData.verifyotp) {
            return res.status(404).json({ status: 404, messages: "OTP invalid" });
        }
    
        let activated = await activatedUser(idusers);
    
        if (!activated) {
            return res
            .status(404)
            .json({ status: 404, messages: "Account failed verification" });
        }

        return res
        .status(201)
        .json({ code: 201, message: "Account Activated, please Login at our login page or App" });
    },
    requestOTP: async (req, res, next) => {
        try {
        let { email } = req.body;
        if (!email || email == "") {
            return res.status(401).json({
            status: 401,
            messages: "Email is required",
            });
        }
        let user = await getUsersByEmailModel(email);
        if (user.rowCount === 0) {
            return res
            .status(401)
            .json({ status: 401, messages: "Email not registered" });
        }

        let userData = user.rows[0];
        let otp = uuidv4()
        let sendOTP = await sendEmailActivatedotp(email, otp, userData.nama);

        if (!sendOTP) {
            return res
            .status(401)
            .json({ status: 401, messages: "Register failed when send email" });
        }

        let otpStatus = await updateOtpUsersModel(otp, userData.idusers);
        if (otpStatus.rowCount === 0) {
            return res
            .status(401)
            .json({ status: 401, messages: "Error create OTP" });
        }

        return res
            .status(201)
            .json({ code: 201, message: "OTP sent successfully", email });
        } catch (err) {
        console.log("OTP Error");
        console.log(err);
        return res.status(404).json({ code: 404, message: "OTP request Error" });
        }
    },
    resetPassword: async (req, res, next) => {
        try {
          let { password,verifyotp,email } = req.body;
          if (!password || password == "" || !verifyotp || verifyotp == "" || !email || email == "") {
            return res.status(401).json({
              status: 401,
              messages: "New password, verifyOTP And email is required",
            });
          }
          let cek = await verifyUsersOTP(email,verifyotp)
          if(cek.rowCount === 0){
            return res
            .status(404)
            .json({ code:404, message: "Data not found, please check your email & otp"})
          }
          password = await argon2.hash(password);
          let result = await updatePasswordUsersModel(password, email);
          if (result.rowCount === 1) {
            return res
              .status(201)
              .json({ code: 201, message: "Password Reset successfully, Please Login" });
          }
          return res
            .status(404)
            .json({ code: 404, message: "Error update password" });
        } catch (err) {
          console.log("Register Error");
          console.log(err);
          return res
            .status(404)
            .json({ code: 404, message: "Register Controller Error" });
        }
      },
}

module.exports = UsersController