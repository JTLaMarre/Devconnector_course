const express = require('express')
const connectDB = require('./config/db')

const app = express();

// connect database
connectDB();


// init middleware
app.use(express.json({extended:false}))


// sends browser that api is working
app.get('/', (req,res)=>res.send(`API running`))

// define routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))

// if no enviroment variable sends to port 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> console.log(`server listening on ${PORT}`))