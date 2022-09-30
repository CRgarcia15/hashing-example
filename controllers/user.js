const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

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