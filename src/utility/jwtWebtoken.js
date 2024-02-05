const jwt = require('jsonwebtoken')

const jwtWebToken = (user) => {
    // const expiresIn = "1 days"
    const expiresIn = "1 days"
    const payload = {
        id: user.id,
        name: user.username,
        roleId: user.roleId
    };

    const signToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: expiresIn} )

    return {
        token : signToken,
        expiresIn: expiresIn
    }
}


module.exports = jwtWebToken