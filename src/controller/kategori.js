const {v4: uuidv4} = require("uuid")
const {
    getKategoriByIdModel,
    createKategoriModel,
    getKategoriModel,
    updateKategoriModel,
    deleteKategoriModel
} = require("../model/kategori")
const { search } = require("../router");
const { Protect } = require("../middleware/private")


const KategoriController = {
    getKategoriById: async(req,res,next) => {
        try{
            let { idkategori } = req.params
            if(idkategori === ""){
                return res.status(404).json({ message: "params id invalid" })
            }
            let kategori = await getKategoriByIdModel(idkategori)
            let result = kategori.rows
            if (!result.length) {
                return res
                    .status(404)
                    .json({ message: "kategori not found or id invalid" });
            }
            console.log(result);
            return res
                .status(200)
                .json({ message: "success getKategoriById", data: result[0] });
        }  catch (err) {
            return res
                .status(404)
                .json({ message: "failed getKategoriById Controller" });
        }
    },
        createKategori: async (req,res,next) => {
        try {
            let { nama,deskripsi,foto } = req.body
            if(req.payload.otoritas !== "Admin"){
                return res.json({code: 404,message: "Hanya Admin yang bisa menambah data"})
            }
            if(
                !nama ||
                nama === "" ||
                !deskripsi ||
                deskripsi === "" ||
                !foto ||
                foto === ""
            ){
                return res.json({code: 404,message: "Harap masukkan Kategori Dengan lengkap"})
            }
            let data = {idkategori: uuidv4(), nama, deskripsi, foto}
            let result = await createKategoriModel(data)
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
            .json({ code: 404, message: "CreateKategori Controller Error"})
        }
    }, 
        getKategori: async (req,res,next) => {
        try{
            let resep = await getKategoriModel()
            let result = resep.rows
            return res.status(200).json({message:"sukses getKategori ",data:result})
        }catch(err){
            return res.status(404).json({message:"gagal getKategori controller"})
        }
    },
        updateKategori: async (req, res, next) => {
        try {
            let { idkategori } = req.params;
            if(req.payload.otoritas !== "Admin"){
                return res.json({code: 404,message: "Hanya Admin yang bisa menambah data"})
            }
            if (idkategori === "") {
                return res.status(404).json({ message: "params id invalid" });
            }
            let { nama, deskripsi, foto} = req.body;
            let kategori = await getKategoriByIdModel(idkategori);
            let resultKategori = kategori.rows;
            if (!resultKategori.length) {
                return res
                    .status(404)
                    .json({ message: "kategori not found or id invalid" });
            }
            let Kategori = resultKategori[0];
            let data = {
                idkategori,
                nama: nama || Kategori.nama,
                deskripsi: deskripsi || Kategori.deskripsi,
                foto: foto || Kategori.foto,
            };

            let result = await updateKategoriModel(data);
            if (result.rowCount === 1) {
                return res
                    .status(201)
                    .json({ code: 201, message: "success update data" });
            }
            return res.status(401).json({code:401,message:"failed update data"})
        } catch (err) {
            return res
                .status(404)
                .json({ message: "failed InputKategori Controller" });
        }
    },
        deleteKategori: async (req,res,next) => {
        try{
            let { idkategori } = req.params;
            if(req.payload.otoritas !== "Admin"){
                return res.json({code: 404,message: "Hanya Admin yang bisa menambah data"})
            }
            if (idkategori === "") {
                return res.status(404).json({ message: "params id invalid" });
            }
            let kategori = await getKategoriByIdModel(idkategori);
            let resultKategori = kategori.rows;
            if (!resultKategori.length) {
                return res
                    .status(404)
                    .json({ message: "kategori not found or id invalid" });
            }
            let result = await deleteKategoriModel(idkategori)
            if (!result.length) {
                return res
                    .status(201)
                    .json({ code: 201, message: "success Delete data" });
            }
            return res.status(200).json({code:401,message:"failed Delete data"})

        }catch(err){
            return res
            .status(404)
            .json({ code: 404, message: "Delete kategori Controller Error"})
        }
    }
}

module.exports = KategoriController