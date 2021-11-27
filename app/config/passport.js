const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')

function init(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        const user = await User.findOne({ email: email })
        if (!user) {
            return dine(null, false, { message: 'No user with this email' })
        }
        const match = await bcrypt.compare(password, user.password)
        try {
            if (match) {
                return done(null, user, { message: 'Logged in succesfuly' })
            }
            return done(null, false, { message: 'Wrong username or password' })
        } catch (error) {
            return done(null, false, { message: 'Something went wrong!' })
        }

    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}

module.exports = init