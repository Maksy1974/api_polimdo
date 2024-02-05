const passport = require('passport')
const jwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


const options = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET
}

passport.use(new jwtStrategy(options, async (payload, done) => {
    const options = {
        where: {
            id: payload.id
        }
    }

    try{
        const user = await prisma.user.findMany(options)

        if (user.length === 0) {
            return done(null, false);
        }

        return done(null, user);
    }catch(err){
        console.log(err)
        return done(err, false);
    }

}))


module.exports = passport.authenticate('jwt', { session: false })