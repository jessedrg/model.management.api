const express = require('express');
const user = require('./Routes/user')
const agency = require('./Routes/agencies')
const mongoose = require('./db/mongoose')

const app = express();
app.use(express.json())
app.use(user)
app.use(agency)






const PORT = process.env.PORT || 5000
//starting the server 
app.listen(PORT,()=>{
    console.log(`Server started on port:${PORT}`)
})
