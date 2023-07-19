const router=require("express").Router();
const user=require("../models/user");
const bcrypt=require("bcrypt");
//register
router.post("/register",async (req,res)=>{
   
    try{
        const hash = await bcrypt.hashSync(req.body.password,10);       

        const newUser=new user({
            userName:req.body.userName,
            email:req.body.email,
            password:hash
        });
        const saved=await newUser.save();
        res.status(200).json(saved);
    }
    catch(err)
    {
        res.status(500).json(err);
    }
    //login
    router.post("/login",async (req,res)=>{
        try{
             const newUser=await user.findOne({userName:req.body.userName});
             !newUser &&  res.status(400).json("invalid user");
                
             const validate=await bcrypt.compare(req.body.password,newUser.password);
             !validate && res.status(400).json("invalid passowrd");
             res.status(200).json({_id:newUser._id,userName:newUser.userName});
             
        }
        catch(err)
        {
            res.status(500).json(err);
        }
    })
    
})
module.exports=router;