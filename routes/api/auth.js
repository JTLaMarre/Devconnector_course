const express =require('express')
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/User')


// @route Get api/user @desc test route @access Public
router.get('/',auth,async (req,res)=>{
try{
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
}catch(err){
console.error(err.message)
res.send(500).send('server error')
}
})
module.exports=router;