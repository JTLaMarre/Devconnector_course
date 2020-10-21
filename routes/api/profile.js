const express =require('express')
const router = express.Router();


// @route Get api/user @desc test route @access Public
router.get('/',(req,res)=>res.send('Profile Route'))

module.exports=router;