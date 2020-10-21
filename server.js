const express = require('express')
const connectDB = require('./config/db')

const app = express();

// connect database
connectDB();


// sends browser that api is working
app.get('/', (req,res)=>res.send(`API running`))

// if no enviroment variable sends to port 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> console.log(`server listening on ${PORT}`))