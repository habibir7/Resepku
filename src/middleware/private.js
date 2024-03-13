const jwt = require("jsonwebtoken")
require("dotenv").config()

const Protect = async (req,res,next) => {
	try{
		let {authorization} = req.headers
		let Bearer = authorization.split(" ")
		let decode = jwt.decode(Bearer[1],process.env.JWT_TOKEN)
		req.payload = decode
		if (req.payload.exp < Math.floor(Date.now() / 1000)) {
            return res.status(401).json({ status: 401, message: "Token Expire, Please Login again" });
        }
		next()
	} catch(err){
		return res.status(404).json({status:404,message:"token wrong"})
	}
}

module.exports = {Protect}