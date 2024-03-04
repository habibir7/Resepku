const {v4: uuidv4} = require("uuid")
const {
    getResepModel,
    getResepByIdModel,
    createResepModel,
    updateResepModel,
    deleteResepModel
} = require("../model/resep")
const { search } = require("../router");

const ResepController = {
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
    },updateResep: async (req, res, next) => {
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