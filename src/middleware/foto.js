const multer = require("multer")

const storage = multer.diskStorage({
	filename: function(res,file,cb){
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
		cb(null, file.fieldname + '-' + uniqueSuffix + '.png')
	}
})

const upload = multer({
	storage,
	limits: {fileSize:5*Math.pow(1024,2)},
	fileFilter: (req,file,cb) => {
		if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jfif'){
			req.isFileValid = true
			cb(null,true)
		} else {
			req.isFileValid = false
			req.isFileValidMessage = "please input image file"
			cb(null,false)
		}
	}
})

module.exports = upload