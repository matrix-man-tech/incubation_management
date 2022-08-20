const router =require('express').Router();
const {
    adminlogin,
    applicationList,
    viewApp,
    updateNewAppStat,
    approveNewAppStat,
    rejectNewAppStat,
    slotDuplicate,
    getApplications,
    getBookingSlots,
    slotUpdate,
    approvedApp,
    processingApp,
    rejectedApp
} = require('../controllers/admincontroller')

router.post('/adminlogin',adminlogin)
router.get('/adminPanel',applicationList)
router.get("/viewApplication/:id", viewApp);
router.patch("/updateNewAppStatus/:id", updateNewAppStat);
router.patch("/approveNewAppStatus/:id", approveNewAppStat);
router.patch("/rejectNewAppStatus/:id", rejectNewAppStat);
router.patch("/slotDuplicate", slotDuplicate);
router.get("/getApplications", getApplications);
router.get("/getBookingSlots", getBookingSlots);
router.post("/slotUpdate", slotUpdate);
router.get("/approved", approvedApp);
router.get("/processing", processingApp);
router.get("/rejected", rejectedApp);


module.exports=router;