const express = require ("express")
const app  = express()
const cors = require ("cors")
const dotenv = require("dotenv")
const connectDatabase = require('./config/connection')
const userRoutes=require('./routes/user')
const adminRoutes = require('./routes/admin')
dotenv.config();
connectDatabase()

app.use(cors({
    origin:['http://localhost:3000'],
    methods:['GET',"POST","PUT","PATCH"],
    credentials:true
}));
app.use(express.json())
app.use('/',userRoutes)
app.use('/admin',adminRoutes)

app.listen(4000,()=>{
    console.log("Server started on port 4000");
})

