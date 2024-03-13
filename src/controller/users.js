const {v4: uuidv4} = require("uuid")
const argon2 = require("argon2")
const {GenerateToken} = require("../helper/token")
const {
    getUsersModel,
    getUsersByUsernameModel,
    getUsersByEmailModel,
    getUsersDetailCountModel,
    getUsersDetailModel,
    createUsersModel,
    updateUsersModel,
    deleteUsersModel
} = require("../model/users")
const { search } = require("../router");
const { Protect } = require("../middleware/private")


const UsersController = {
    login: async (req, res, next) => {
		let { username, password } = req.body;
        if (!username || !password || username == "" || password == "") {
            return res
                .status(401)
                .json({
                    status: 401,
                    messages: "username & password is required",
                });
        }
        let user = await getUsersByUsernameModel(username);
        if (user.rowCount === 0) {
            return res
			.status(401)
			.json({ status: 401, messages: "username not register" });
        }
		let userData = user.rows[0]
		
		let isVerify = await argon2.verify(userData.password,password)
        if (!isVerify) {
			return res
			.status(401)
			.json({ status: 401, messages: "password wrong" });
        }
		console.log(userData)

		delete userData.password
		let token = GenerateToken(userData)
		
		return res.status(201).json({ status: 201, messages: "login success",token });
	},
    getUsersDetail: async (req, res, next) => {
        try {
			let searchBy
			if(req.query.searchBy === ""){
				if(req.query.searchBy === "namalengkap" ||  req.query.searchBy === "surname" ||  req.query.searchBy === "email" ||  req.query.searchBy === "alamat"){
					searchBy = req.query.searchBy
				} else {
					searchBy = "namalengkap"
				}
			} else{
				searchBy = "namalengkap"
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
                let users = await getUsersByUsernameModel(req.payload.username)
                let result = users.rows
                return res.status(200).json({message:"sukses getUsersByUsername",data:result})
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
    getUsersByUsername: async(req,res,next) => {
        try{
            let { username } = req.params
            if(username === ""){
                return res.status(404).json({ message: "Username invalid" })
            }
            let users = await getUsersByUsernameModel(username)
            let result = users.rows
            if (!result.length) {
                return res
                    .status(404)
                    .json({ message: "users not found or username invalid" });
            }
            console.log(result);
            return res
                .status(200)
                .json({ message: "success getUsersByUsername", data: result[0] });
        }  catch (err) {
            console.log("getUsersByUsername error");
            console.log(err);
            return res
                .status(404)
                .json({ message: "failed getUsersByUsername Controller" });
        }
    },
    createUsers: async (req,res,next) => {
        try {
            let { username,password,namalengkap,surname,email,alamat} = req.body
            if(
                !username || 
                username === "" ||
                !password ||
                password === "" ||
                !namalengkap ||
                namalengkap === "" ||
                !surname ||
                surname === "" ||
                !email ||
                email === "" ||
                !alamat ||
                alamat === ""
            ){
                return res.json({code: 404,message: "Harap masukkan data dengan lengkap"})
            }
            password = await argon2.hash(password)
            let data = {idusers: uuidv4(),username, password, namalengkap, surname, email, alamat}
            let cek = await getUsersByUsernameModel(username)
            if(cek.rowCount === 1){
                return res.json({code: 404,message: "Username sudah ada harap masukkan username yang lain"})
            }
            cek = await getUsersByEmailModel(email)
            if(cek.rowCount === 1){
                return res.json({code: 404,message: "Email sudah Terdaftar"})
            }
            let result = await createUsersModel(data)
            if(result.rowCount === 1){
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
            let { username } = req.params;
            if (username === "") {
                return res.status(404).json({ message: "Masukkan Username anda" });
            }
            if (req.payload.otoritas !== "Admin" && username !== req.payload.username) {
                return res.status(403).json({ message: "You are not allowed to edit another user's data" });
            }
            let { password, namalengkap, surname, email, alamat } = req.body;
            let users = await getUsersByUsernameModel(username);
            let resultUsers = users.rows;
            if (!resultUsers.length) {
                return res
                    .status(404)
                    .json({ message: "users tidak ditemukan, harap masukkan username dengan benar !" });
            }
            let Users = resultUsers[0];
            let data = {
                username,
                password: password || Users.password,
                namalengkap: namalengkap || Users.namalengkap,
                surname: surname || Users.surname,
                email: email || Users.email,
                alamat: alamat || Users.alamat
            };

            let result = await updateUsersModel(data);
            if (result.rowCount === 1) {
                return res
                    .status(201)
                    .json({ code: 201, message: "success update data" });
            }
            return res.status(401).json({code:401,message:"failed update data"})
        } catch (err) {
            console.log("InputUsers error");
            console.log(err);
            return res
                .status(404)
                .json({ message: "failed InputUsers Controller" });
        }
    },
    
    deleteUsers: async (req,res,next) => {
        try{
            let { username } = req.params;
            if (username === "") {
                return res.status(404).json({ message: "params username invalid" });
            }
            if (req.payload.otoritas !== "Admin" && username !== req.payload.username) {
                return res.status(403).json({ message: "You are not allowed to edit another user's data" });
              }
            let users = await getUsersByUsernameModel(username);
            let resultUsers = users.rows;
            if (!resultUsers.length) {
                return res
                    .status(404)
                    .json({ message: "data not found or username invalid" });
            }
            let result = await deleteUsersModel(username)
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
    }
}

module.exports = UsersController