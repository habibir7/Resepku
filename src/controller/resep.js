const {v4: uuidv4} = require("uuid")
const {
    getResepModel,
    getResepByIdModel,
    getResepByIdUsersModel,
    getResepDetailCountModel,
    getResepDetailModel,
    createResepModel,
    updateResepModel,
    deleteResepModel
} = require("../model/resep")
const { search } = require("../router");
const { Protect } = require("../middleware/private")
const cloudinary = require("../config/foto")

const ResepController = {
    getResepDetail: async (req, res, next) => {
        try {
			let searchBy
			if(req.query.searchBy === ""){
				if(req.query.searchBy === "namaresep" ||  req.query.searchBy === "namalengkap" ||  req.query.searchBy === "komposisi" ||  req.query.searchBy === "nama"){
					searchBy = req.query.searchBy
				} else {
					searchBy = "namaresep"
				}
			} else{
				searchBy = "namaresep"
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

            let resep = await getResepDetailModel(data);
            let count = await getResepDetailCountModel(data);
			let total = count.rowCount
            let result = resep.rows;
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
                .json({ message: "success getResepDetail", data: result ,pagination});
        } catch (err) {
            console.log("getResep error");
            console.log(err);
            return res
                .status(404)
                .json({ message: "failed getResepDetail Controller" });
        }
    },
    getResep: async (req,res,next) => {
        try{
            let resep = await getResepModel()
            let result = resep.rows
            return res.status(200).json({message:"sukses getResep",data:result})
        }catch(err){
            return res.status(404).json({message:"gagal getResep controller"})
        }
    },
    getResepById: async(req,res,next) => {
        try{
            let { idresep } = req.params
            if(idresep === ""){
                return res.status(404).json({ message: "params id invalid" })
            }
            let resep = await getResepByIdModel(idresep)
            let result = resep.rows
            if (!result.length) {
                return res
                    .status(404)
                    .json({ message: "recipe not found or id invalid" });
            }
            console.log(result);
            return res
                .status(200)
                .json({ message: "success getResepById", data: result[0] });
        }  catch (err) {
            return res
                .status(404)
                .json({ message: "failed getResepById Controller" });
        }
    },
    getResepByIdUsers: async(req,res,next) => {
        try{
            let { idusers } = req.params
            if(idusers === ""){
                return res.status(404).json({ message: "params id invalid" })
            }
            let resep = await getResepByIdUsersModel(idusers)
            let result = resep.rows
            if (!result.length) {
                return res
                    .status(404)
                    .json({ message: "recipe not found or id invalid" });
            }
            console.log(result);
            return res
                .status(200)
                .json({ message: "success getResepById", data: result });
        }  catch (err) {
            return res
                .status(404)
                .json({ message: "failed getResepById Controller" });
        }
    },
    updateResep: async (req, res, next) => {
        try {
            let { idresep } = req.params;
            if (idresep === "") {
                return res.status(404).json({ message: "params id invalid" });
            }
            let { namaresep, idusers, komposisi, idkategori, foto } = req.body;
            console.log(idresep)
            let resep = await getResepByIdModel(idresep);
            let resultResep = resep.rows;
            if (!resultResep.length) {
                return res
                    .status(404)
                    .json({ message: "resep not found or id invalid" });
            }
            let Resep = resultResep[0];
            let data = {
                idresep,
                namaresep: namaresep || Resep.namaresep,
                idusers: idusers || Resep.idusers,
                komposisi: komposisi || Resep.komposisi,
                idkategori: idkategori || Resep.idkategori,
            };
            if(Resep.idusers !== req.payload.idusers && req.payload.otoritas !== "Admin"){
                return res.status(404).json({ message: "Anda dilarang untuk mengedit data ini" });
            }
            if(!req.file){
                data.foto = Resep.foto
                let result = await updateResepModel(data);
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
                let result = await updateResepModel(data);
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
    createResep: async (req,res,next) => {
        try {
            let { namaresep,komposisi,idkategori,foto} = req.body
            if(
                !namaresep || 
                namaresep === "" ||
                !komposisi ||
                komposisi === "" ||
                !idkategori ||
                idkategori === ""
            ){
                return res.json({code: 404,message: "Harap masukkan Resep Dengan lengkap"})
            }
            let idusers = req.payload.idusers
            console.log(req.file)
            console.log(req.isFileValid)
            if (!req.file) {
                return res.status(404).json({ code: 404, message: "photo required" });
            }
            if (!req.isFileValid) {
                return res.status(404).json({ code: 404, message: req.isFileValidMessage });
            }
                const imageUpload = await cloudinary.uploader.upload(
                    req.file.path,
                    {
                        folder: "Resepku",
                    }
                )
            console.log("cloudinary")
            console.log(imageUpload);

            if (!imageUpload) {
                return res.json({ code: 404, message: "upload foto failed" });
            }

            let data = {idresep: uuidv4(), namaresep, idusers, komposisi, idkategori, foto : imageUpload.secure_url}
            let result = await createResepModel(data)
            if(result.rowCount === 1){
                return res
                .status(201)
                .json({ code:201, message: "Data berhasil Di input"})
            }
            return res
            .status(401)
            .json({ code: 401, message: "Maaf data tidak berhasil Di input"})
        } catch (err){
            return res
            .status(404)
            .json({ code: 404, message: "CreateResep Controller Error"})
        }
    },
    deleteResep: async (req,res,next) => {
        try{
            let { idresep } = req.params;
            if (idresep === "") {
                return res.status(404).json({ message: "params id invalid" });
            }
            let resep = await getResepByIdModel(idresep);
            let resultResep = resep.rows;
            let Resep = resultResep[0];
            if (!resultResep.length) {
                return res
                    .status(404)
                    .json({ message: "resep not found or id invalid" });
            }
            if (req.payload.idusers !== Resep.idusers && req.payload.otoritas !== "Admin") {
                return res.status(403).json({ message: "Anda tidak bisa mengedit data orang lain" });
            }
            let result = await deleteResepModel(idresep)
            if (!result.length) {
                return res
                    .status(201)
                    .json({ code: 201, message: "success Delete data" });
            }
            return res.status(404).json({code:401,message:"failed Delete data"})

        }catch(err){
            return res
            .status(404)
            .json({ code: 404, message: "Deleteresep Controller Error"})
        }
    }
}

module.exports = ResepController