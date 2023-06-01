const express = require('express')
const cors=require("cors")
const app = express()
const Router=require("../Backend/Router/index.js")
const connectDb=require("../Backend/Db/db.js")
require('dotenv').config()


app.use(express.json())
app.use(cors())
app.use(Router)
connectDb()

const PORT=process.env.PORT || 5003;

app.get('/', (req, res) => {
  res.send('working!')
})


app.listen(PORT, () => {
  console.log(`server is Listening on port ${PORT}`)
})