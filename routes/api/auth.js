const express =require('express')
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')



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



// @route Post api/auth @desc auth and get token @access Public
router.post('/', [
        check('email', 'please include a valide email').isEmail(),
    check('password', 'password required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
        // See if user exists
        let user = await User.findOne({ email });

        if (!user) {
            res.status(400).json({ error: [{ message: 'invalid credentials' }] });
        }
        

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            res.status(400).json({ error: [{ message: 'invalid credentials' }] });
        }

        // return json webtoken
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
           
            { expiresIn: 36000},
            (err, token) => {
                if (err) throw err;
                res.json({token:token})
            }
        )
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }


  
})


module.exports=router;