const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const bodyParser = require('body-parser')
const Router = require("./src/router")
const app = express()
const port = 3000



app.use(cors())


app.use(bodyParser.urlencoded({ extended: false}))

app.use(morgan("combined"))

app.get("/", (req,res) => {
    res.send("<h1> Hello World!</h1>")
})

app.use(Router)

app.listen(port, ()=> {
    console.log(`Program berjalan di port:${port}, buka di localhost:${port}`)
})