
const express=require("express");
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const pinRoute=require("./routes/pins");
const userRoute=require("./routes/users");
const cors=require("cors");
dotenv.config();
const app=express();
app.use(express.json());
app.use(cors())
mongoose.connect(process.env.url).then(()=>{
    console.log("connected")}).catch((err)=>{console.log("err")});

app.use("/api/pins",pinRoute);
app.use("/api/users",userRoute);
app.listen(8800,()=>{
    console.log("serveer is running");
})