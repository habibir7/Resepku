const {v4: uuidv4} = require("uuid")
const {
    getResepModel,
    getResepByIdModel,
    getResepDetailCountModel,
    getResepDetailModel,
    createResepModel,
    updateResepModel,
    deleteResepModel
} = require("../model/resep")
const { search } = require("../router");

const ResepController = {
    getResepDetail: async (req, res, next) => {
        try {
			let searchBy
			if(req.query.searchBy === ""){
				if(req.query.searchBy === "namaresep" ||  req.query.searchBy === "author" ||  req.query.searchBy === "komposisi" ||  req.query.searchBy === "kategori"){
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
				if(req.query.sortBy === "dibuatpada" ||  req.query.sortBy === "dieditpada"){
					sortBy = req.query.sortBy
				} else {
					sortBy = "dibuatpada"
				}
			} else{
				sortBy = "dibuatpada"
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
            console.log("resep controller")
            let result = resep.rows
            console.log(result)
            return res.status(200).json({message:"sukses getResep",data:result})
        }catch(err){
            console.log("resep controller error")
            console.log(err)
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
            console.log("getResepById error");
            console.log(err);
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
            let { namaresep, author, komposisi, kategori, foto } = req.body;
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
                author: author || Resep.author,
                komposisi: komposisi || Resep.komposisi,
                kategori: kategori || Resep.kategori,
                foto: foto || Resep.foto,
            };

            console.log(komposisi)

            let result = await updateResepModel(data);
            if (result.rowCount === 1) {
                return res
                    .status(201)
                    .json({ code: 201, message: "success update data" });
            }
            return res.status(401).json({code:401,message:"failed update data"})
        } catch (err) {
            console.log("InputResep error");
            console.log(err);
            return res
                .status(404)
                .json({ message: "failed InputResep Controller" });
        }
    },
    createResep: async (req,res,next) => {
        try {
            let { namaresep,author,komposisi,kategori,foto} = req.body
            if(
                !namaresep || 
                namaresep === "" ||
                !author ||
                author === "" ||
                !komposisi ||
                komposisi === "" ||
                !kategori ||
                kategori === "" ||
                !foto ||
                foto === ""
            ){
                return res.json({code: 404,message: "Harap masukkan Resep Dengan lengkap"})
            }
            if(kategori != "Main Course" && kategori != "Appetizer" && kategori != "Dessert"){
                return res.json({code: 404,message: "Error : kategori must contain Main Course or Appetize or Dessert"})
            }
            let data = {idresep: uuidv4(), namaresep, author, komposisi, kategori, foto}
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
            console.log("CreateResep Error")
            console.log(err)
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
            if (!resultResep.length) {
                return res
                    .status(404)
                    .json({ message: "resep not found or id invalid" });
            }
            let result = await deleteResepModel(idresep)
            if (!result.length) {
                return res
                    .status(201)
                    .json({ code: 201, message: "success Delete data" });
            }
            return res.status(200).json({code:401,message:"failed Delete data"})

        }catch(err){
            console.log("deleteResep Error")
            console.log(err)
            return res
            .status(404)
            .json({ code: 404, message: "Deleteresep Controller Error"})
        }
    }
}

module.exports = ResepController