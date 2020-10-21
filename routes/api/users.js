const express = require('express')
const router = express.Router();
const { check, validationResult } = require('express-validator')


// @route Post api/user @desc register data @access Public
router.post('/', [
    check('name', 'Name isrequired').not().isEmpty(),
    check('email', 'please include a valide email').isEmail(),
    check('password','pleas enter a password with at least 6 characters').isLength(6)
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    console.log(req.body)
    res.send('User Route')

})

module.exports = router;