const mongoose = require ('mongoose');
const bcrypt=require('bcrypt')
 const adminSchema=new mongoose.Schema({
    name:{
        type:String,
        required: [true,'Name is Required'],
    },
    email:{
        type:String,
        required: [true,'Email is Required'],
        unique:true,
    },
   
    password:{
        type:String,
        required:[true,"Password is Required"]
    },

 });
 
 adminSchema.pre('save',async function(next){
     const salt =await bcrypt.genSalt();
     this.password=await bcrypt.hash(this.password,salt);
     next()
     
    })

    adminSchema.statics.login=async function (email,password){
        const admin=await this.findOne({email});
        if(admin){
            const auth= await bcrypt.compare(password,admin.password)
            if(auth){
                return admin;
            }
            throw Error('Incorrect Password');
        }
        throw Error('Incorrect Email')
    }
    module.exports=mongoose.model("Admin",adminSchema)