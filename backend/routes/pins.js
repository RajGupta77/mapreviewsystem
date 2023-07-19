const router=require("express").Router();
const pin=require("../models/pin");
//post
router.post("/",async (req,res)=>{
    const newpin=new pin(req.body);
    try{
      const saved= await newpin.save();
      res.status(200).json(saved);
    }
    catch(err)
    {
        res.status(500).json(err);
    }
});
//get
router.get("/",async (req,res)=>{
    try{
         const savepin=await pin.find();
         res.status(200).json(savepin);
    }
    catch(err)
    {
        res.status(500).json(err);
    }
})
module.exports=router;