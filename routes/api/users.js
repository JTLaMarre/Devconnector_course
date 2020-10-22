const express = require('express')
const router = express.Router();
const { check, validationResult } = require('express-validator')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

// need to import to check things in the req.body
const User = require('../../models/User')


// @route Post api/user @desc register data @access Public
router.post('/', [
    check('name', 'Name isrequired').not().isEmpty(),
    check('email', 'please include a valide email').isEmail(),
    check('password', 'pleas enter a password with at least 6 characters').isLength(6)
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
        // See if user exists
        let user = await User.findOne({ email });

        if (user) {
            res.status(400).json({ error: [{ message: 'User already exists' }] });
        }
        // get user gravatar
        const avatar = gravatar.url(email, {
            s: 200,
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        })

        // encrypt password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt)

        await user.save()

        // return json webtoken
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
           
            { expiresIn: '5 days'},
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

module.exports = router;