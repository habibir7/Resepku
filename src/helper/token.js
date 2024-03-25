const jwt = require("jsonwebtoken")
require("dotenv").config()

const GenerateToken = data => {
	const token = jwt.sign(data,process.env.JWT_TOKEN,{expiresIn: "1d"})
	return token
}

module.exports = {GenerateToken}