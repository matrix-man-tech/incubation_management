const AdminModel=require('../Models/adminModel')
const jwt=require('jsonwebtoken')
const applicationModel=require('../Models/applicationModel')
const slotModel=require('../Models/slotModel')


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

module.exports.adminlogin=async(req,res,next)=>{
    try{
        console.log('in adminlogin CONTROL  ');
        const {email,password}=req.body;
        const admin=await AdminModel.login(email,password);
        const token=createToken(admin._id);
        res.cookie('jwt',token,{
            withCrdentials:true,
            httpOnly:false,
            maxAge:maxAge * 1000,
        });
        res.status(200).json({data:admin,admin:admin._id,created:true})
    }catch(err){
        console.log(err);
        console.log('in adminlogin err');
        const errors=handleErrors(err);
        res.json({errors,created:false});
    }   
};
module.exports.applicationList = async (req, res) => {
    const applicationList = await applicationModel.find({ status: "PENDING" });
    if (applicationList.length > 0) {
      res.json(applicationList);
    } else {
      res.json({ status: false });
    }
  };
  module.exports.viewApp = async (req, res) => {
    console.log("iddddddddd" + req.params.id);
    const Application = await applicationModel.findOne({ _id: req.params.id });
    console.log(Application);
    res.json(Application);
  };
  module.exports.updateNewAppStat = async (req, res) => {
    const Application = await applicationModel.updateOne(
      { _id: req.params.id },
      { $set: { status: "PROCESSING" } }
    );
    res.json({ status: true });
  };
  module.exports.approveNewAppStat = async (req, res) => {
    const Application = await applicationModel.updateOne(
      { _id: req.params.id },
      { $set: { status: "APPROVED" } }
    );
    res.json({ status: true });
  };
  module.exports.rejectNewAppStat = async (req, res) => {
    const Application = await applicationModel.updateOne(
      { _id: req.params.id },
      { $set: { status: "REJECTED" } }
    );
    res.json({ status: true });
  };
  module.exports.slotDuplicate = async(req,res) =>{
    try {
      const{applicantId}=req.body
      const duplicate = await applicationModel.findById({_id:applicantId})
      console.log(duplicate);
      if(!duplicate.bookingStatus){
        await applicationModel.findByIdAndUpdate({_id:applicantId},{$set:{bookingStatus:true}})
        res.status(200).json({ noDuplicate: true });
      }
      res.status(200).json({ duplicateRemoved: true });
    } catch (error) {
      res.json({error,slotDuplicate:false});
    }
  }
  module.exports.getApplications = async (req, res) => {
    try {
      const approvedApp = await applicationModel.find({
        $and: [{ status: "APPROVED" }, { bookingStatus: false }],
      });
      res.json(approvedApp);
    } catch (error) {
      res.json({error,bookedSlots:false})
    }    
  };
  module.exports.getBookingSlots = async (req, res) => {
    try {
      const slots = await slotModel.find({});
      res.json(slots);      
    } catch (error) {
      res.json({error,bookedSlots:false})
    }
    
  };
  module.exports.slotUpdate = async (req, res) => {
    try {
      const { applicantId, slotId, slotSection,slotNumber } = req.body;
      const application = await applicationModel.findByIdAndUpdate({ _id: applicantId },
        {bookingStatus:true,
          slotCode:slotId,
          section:slotSection,
          slot_no:slotNumber});
      console.log(application);
      const bookSlot = await slotModel.findByIdAndUpdate(
        { _id: slotId },
        {
          $set: {
            selected: true,
            companyname: application.companyName,
            user_email: application.email,
          },
        }
      );
      res.json({status:true});
    } catch (error) {
      res.json({error,slotUpdate:false})
    }
  };
  module.exports.approvedApp = async (req, res) => {
    const approved = await applicationModel.find({ status: "APPROVED" });
    if (approved.length > 0) {
      res.json({ approved });
    } else {
      res.json({ status: false });
    }
  };
  module.exports.processingApp = async (req, res) => {
    const processing = await applicationModel.find({ status: "PROCESSING" });
    if (processing.length > 0) {
      res.json({ processing });
    } else {
      res.json({ status: false });
    }
  };
  module.exports.rejectedApp = async (req, res) => {
    const rejected = await applicationModel.find({ status: "REJECTED" });
    if (rejected.length > 0) {
      res.json({ rejected });
    } else {
      res.json({ status: false });
    }
  };
  