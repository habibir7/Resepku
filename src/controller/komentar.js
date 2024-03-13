const {v4: uuidv4} = require("uuid")
const {
    getKomentarModel,
    getKomentarByIdModel,
    getKomentarDetailCountModel,
    getKomentarDetailModel,
    createKomentarModel,
    updateKomentarModel,
    deleteKomentarModel
} = require("../model/komentar")
const {
    getResepByIdModel
} = require("../model/resep")
const { search } = require("../router");

const KomentarController = {
    getKomentarDetail: async (req, res, next) => {
        try {
			let searchBy
			if(req.query.searchBy === ""){
				if(req.query.searchBy === "namaresep" ||  req.query.searchBy === "idusers" ||  req.query.searchBy === "isi"){
					searchBy = req.query.searchBy
				} else {
					searchBy = "namaresep"
				}
			} else{
				searchBy = "namaresep"
			}
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

			let data = {searchBy,search,sortBy,sort,limit,offset}

            let komentar = await getKomentarDetailModel(data);
            let count = await getKomentarDetailCountModel(data);
			let total = count.rowCount
            let result = komentar.rows;
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
                .json({ message: "success getKomentarDetail", data: result ,pagination});
        } catch (err) {
            console.log("getKomentar error");
            console.log(err);
            return res
                .status(404)
                .json({ message: "failed getKomentarDetail Controller" });
        }
    },
    getKomentar: async (req,res,next) => {
        try{
            let komentar = await getKomentarModel()
            console.log("komentar controller")
            let result = komentar.rows
            return res.status(200).json({message:"sukses getKomentar",data:result})
        }catch(err){
            console.log("komentar controller error")
            return res.status(404).json({message:"gagal getKomentar controller"})
        }
    },
    getKomentarById: async(req,res,next) => {
        try{
            let { idkomentar } = req.params
            if(idkomentar === ""){
                return res.status(404).json({ message: "params id invalid" })
            }
            let komentar = await getKomentarByIdModel(idkomentar)
            let result = komentar.rows
            if (!result.length) {
                return res
                    .status(404)
                    .json({ message: "recipe not found or id invalid" });
            }
            return res
                .status(200)
                .json({ message: "success getKomentarById", data: result[0] });
        }  catch (err) {
            console.log("getKomentarById error");
            console.log(err);
            return res
                .status(404)
                .json({ message: "failed getKomentarById Controller" });
        }
    }, 
    updateKomentar: async (req, res, next) => {
        try {
            let { idkomentar } = req.params;
            if (idkomentar === "") {
                return res.status(404).json({ message: "params id invalid" });
            }
            let { isi } = req.body;
            console.log(idkomentar)
            let komentar = await getKomentarByIdModel(idkomentar);
            let resultKomentar = komentar.rows;
            if (!resultKomentar.length) {
                return res
                    .status(404)
                    .json({ message: "komentar not found or id invalid" });
            }
            let Komentar = resultKomentar[0];
            let data = {
                idkomentar,
                isi: isi || Komentar.isi,
            };
            if(Komentar.idusers !== req.payload.idusers && req.payload.otoritas !== "Admin"){
                return res
                    .status(404)
                    .json({ message: "error this comment isn't yours" });
            }
            let result = await updateKomentarModel(data);
            if (result.rowCount === 1) {
                return res
                    .status(201)
                    .json({ code: 201, message: "success update data" });
            }
            return res.status(401).json({code:401,message:"failed update data"})
        } catch (err) {
            console.log("InputKomentar error");
            console.log(err);
            return res
                .status(404)
                .json({ message: "failed InputKomentar Controller" });
        }
    },
    createKomentar: async (req,res,next) => {
        try {
            let { idresep,isi} = req.body
            if(
                !idresep || 
                idresep === "" ||
                !isi ||
                isi === ""
            ){
                return res.json({code: 404,message: "Harap masukkan Komentar Dengan lengkap"})
            }
            let cek = await getResepByIdModel(idresep)
            if(cek.rowCount == 0){
                return res.json({code: 404,message: "Error idresep Invalid"})
            }
            let idusers = req.payload.idusers
            let data = {idkomentar: uuidv4(), idresep, idusers, isi}
            let result = await createKomentarModel(data)
            if(result.rowCount === 1){
                return res
                .status(201)
                .json({ code:201, message: "Data berhasil Di input"})
            }
            return res
            .status(401)
            .json({ code: 401, message: "Maaf data tidak berhasil Di input"})
        } catch (err){
            console.log("CreateKomentar Error")
            console.log(err)
            return res
            .status(404)
            .json({ code: 404, message: "CreateKomentar Controller Error"})
        }
    },
    deleteKomentar: async (req,res,next) => {
        try{
            let { idkomentar } = req.params;
            if (idkomentar === "") {
                return res.status(404).json({ message: "params id invalid" });
            }
            let komentar = await getKomentarByIdModel(idkomentar);
            let resultKomentar = komentar.rows;
            if (!resultKomentar.length) {
                return res
                    .status(404)
                    .json({ message: "komentar not found or id invalid" });
            }
            let Komentar = resultKomentar[0];
            if(Komentar.idusers !== req.payload.idusers && req.payload.otoritas !== "Admin"){
                return res.json({code: 404,message: "Error insert your own komentar"})
            }
            let result = await deleteKomentarModel(idkomentar)
            if (!result.length) {
                return res
                    .status(201)
                    .json({ code: 201, message: "success Delete data" });
            }
            return res.status(200).json({code:401,message:"failed Delete data"})

        }catch(err){
            console.log("deleteKomentar Error")
            console.log(err)
            return res
            .status(404)
            .json({ code: 404, message: "Deletekomentar Controller Error"})
        }
    }
}

module.exports = KomentarController