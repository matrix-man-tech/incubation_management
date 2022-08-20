const { login,signup,application,status } = require('../controllers/usercontroller');
const router =require('express').Router();

router.post('/login',login)
router.post('/signup',signup)
router.post('/application',application)
router.get('/status/:id',status)

module.exports=router;