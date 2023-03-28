const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validateJWT} = require('../middleware/auth')

router.post('/login', async (req, res) => {
    const {username, password} = req.body

    const user = await User.findOne({username})
    if (!user) {
        res.status(403).json({'message': 'invalid credentials'})
        return
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if(isValidPassword) {
        res.status(422)
        res.json({'message': 'invalid credentials'})
        return;
    }

    res.json({'message': 'You logged in'})
    //JWT 
    //this part decides what data is added to the token
    const payload = {
    id: user._id,
    username: user.username
    }
    //creates token and decides how long to store it for
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d'})
    //only returns data from token. MAKE SURE THAT IS ONLY THE TOKEN AND NOTHING ELSE.
    res.json({'token': token})
})

//CREATE USER
router.post('/', async (req, res) => {
    const {username, password} = req.body
    const createdUser = await new User({
        username,
        password: await bcrypt.hash(password, 12)
    }).save()
    // JWT Id is stored once when user is created. This is so that you don't have to do so many request to the DB
    const payload = {
        id: createdUser._id,
        username:createdUser.username
    }
    // Session ends in 1 day 
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d'})

    res.json({'token': token})
})

router.get('/friends', validateJWT, async(req, res) => {
    validateJWT()
    console.log(req.user)
    const user = await User.findOne({username: req.user.username})
    console.log(user)
    res.json({'message': 'Here are my friends'})
})

module.exports = router