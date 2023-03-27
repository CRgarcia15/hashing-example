const jwt = require('jsonwebtoken')

function validateJWT(req, res, next) {

    const authHeader = req.headers.authorization

   if (!authHeader){
    res.json({'message': 'invalid credentails'})
    return
   }
    
    try {
         const token = authHeader.split(' ')[1]
        const validToken = jwt.verify(token, process.env.JWT_SECRET)
        req.user = validToken
        next()
    }catch(error) {
        console.log(error)
        console.log({'messsage': 'invalid credentials'})
        return
    }
}

module.exports = {validateJWT}