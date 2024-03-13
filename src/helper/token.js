const jwt = require("jsonwebtoken")
require("dotenv").config()

const GenerateToken = data => {
	const token = jwt.sign(data,process.env.JWT_TOKEN,{expiresIn: "10m"})
	return token
}

module.exports = {GenerateToken}