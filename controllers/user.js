const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const user = require('../models/user')

router.post('/login', async (req, res) => {
    const {username, password} = req.body

    const user = await User.findOne({username})
    if (!user) res.status(403).json({'message': 'invalid credentials'})

    const isValidPassword = await bcrypt.compare(password, user.password)
    if(isValidPassword) {
        res.status(422)
        res.json({'message': 'invalid credentials'})
        return;
    }

    res.json({'message': 'You logged in'})
    
    //JWT 
    const payload = {
    id: user._id,
    username: user.username
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d'})

    res.json({'token': token})
})



router.post('/', async (req, res) => {
    const {username, password} = req.body
    const createdUser = await new User({
        username,
        password: await bcrypt.hash(password, 12)
    }).save()

    res.json(createdUser)
})

module.exports = router