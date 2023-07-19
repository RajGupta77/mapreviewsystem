const mongoose=require("mongoose");
const pinSchema=new mongoose.Schema({
    longitude:{
        type:Number,
        require:true,
    },
    latitude:{
        type:Number,
        require:true,
    },
    userName:{
       type:String,
       require:true,
    },
    title:{
        type:String,
        require:true,
    },
    desc:{
        type:String,
    },
    rating:{
        type:Number,
        min:1,
        max:5
    }
})
module.exports=mongoose.model("pin",pinSchema);