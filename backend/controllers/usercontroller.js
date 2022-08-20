const UserModel=require('../Models/UserModel')
const applicationModel=require('../Models/applicationModel')
const jwt=require('jsonwebtoken')

const maxAge=3*24*60*60;
const createToken=(id)=>{
    return jwt.sign({id},'Amal super secret key',{
        expiresIn:maxAge,
    });
};

const handleErrors = (err)=> {
    let errors = {email:'',password:''};
    if (err.message ==='Incorrect Email') errors.email='The email is not registerd'
    if (err.message ==='Incorrect Password') errors.password='The Password is incorrect'
    if(err.code === 11000){
        errors.email='Email is already registered'
        return errors;
    }
    if(err.message.includes("Users validation failed")){
        console.log('inside err.message');
        Object.values(err.errors).forEach(({properties}) =>{
            errors[properties.path]=properties.message;
        });
    }
    return errors;
};

module.exports.signup=async(req,res,next)=>{ 
    try{
    const {name,email,password}=req.body;
    const user=await UserModel.create({name,email,password});
    const token=createToken(user._id);
    res.cookie('jwt',token,{
        withCrdentials:true,
        httpOnly:false,
        maxAge:maxAge * 1000,
    });
    res.status(201).json({user:user._id,created:true})
}catch(err){
    console.log(err);
    const errors=handleErrors(err);
    res.json({errors,created:false});
}
};

module.exports.login=async(req,res,next)=>{
    try{
        const {email,password}=req.body;
        const user=await UserModel.login(email,password);
        const token=createToken(user._id);
        res.cookie('jwt',token,{
            withCrdentials:true,
            httpOnly:false,
            maxAge:maxAge * 1000,
        });
        res.status(200).json({data:user,user:user._id,created:true})
    }catch(err){
        console.log(err);
        const errors=handleErrors(err);
        res.json({errors,created:false});
    }   
};
module.exports.application = async (req, res) => {
    try {
      console.log(req.body);
      const {
        name,
        email,
        address,
        city,
        state,
        phoneNo,
        companyName,
        team,
        product,
        problem,
        solution,
        proposition,
        competators,
        revenue,
        market,
        plan,
        type,
        proposal,
        userId
      } = req.body;
      if (
        name &&
        email &&
        address &&
        city &&
        state &&
        phoneNo &&
        companyName &&
        team &&
        product &&
        problem &&
        solution &&
        proposition &&
        competators &&
        revenue &&
        market &&
        plan &&
        type &&
        proposal &&
        userId 
      ) {
        console.log("Reg Success");
        const newApplication = await applicationModel.create({
          name,
          email,
          address,
          city,
          state,
          phoneNo,
          companyName,
          team,
          product,
          problem,
          solution,
          proposition,
          competators,
          revenue,
          market,
          plan,
          type,
          proposal,
          status: "PENDING",
          userId,
          bookingStatus: false,
          slotCode: "null",
        });
        res.status(201).json({ newApplication,status:true });
      } else {
        console.log("Reg Failed");
        res.status(401).json({ Error });
      }
    } catch (error) {
      console.log("Reg Failedddddddd");
    }
  };
  module.exports.status = async (req, res) => {
    console.log("Statusssssssssssssss");
    console.log(req.params.id);
    const ViewStatus = await applicationModel.find({ userId: req.params.id });
    res.json(ViewStatus);
  };


