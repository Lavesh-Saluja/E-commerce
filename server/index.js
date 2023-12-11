const express=require('express');
const app = express();
const dotenv = require("dotenv");
dotenv.config({path:'./config.env'});

const port = process.env.PORT;
console.log(port)
app.use(express.json());
app.listen(port,()=>{
    console.log("App running on port ",port)
});

app.use("/",require('./routes/auth'));
