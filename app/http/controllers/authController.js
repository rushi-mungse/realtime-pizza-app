const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')

function authController() {
    return {
        login(req, res) {
            res.render('auth/login')
        },
        postLogin(req, res, next) {
            const { email, password } = req.body;
            if (!email || !password) {
                req.flash('error', 'All fields are required')
                return res.redirect('/login')
            }
            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    req.flash('error', info.message)
                    return next(err)
                }
                if (!user) {
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if (err) {
                        req.flash('error', info.message)
                        return next(err)
                    }
                    return res.redirect('/customer/order')
                })
            })(req, res, next)
        },
        register(req, res) {
            res.render('auth/register')
        },

        async postRegister(req, res) {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                req.flash('name', name)
                req.flash('email', email)
                req.flash('error', 'All fields are required')
                return res.redirect('/register')
            }
            const exist = await User.exists({ email })

            if (exist) {
                req.flash('name', name)
                req.flash('email', email)
                req.flash('error', 'Email already registered')
                return res.redirect('/register')
            }
            const hashPassword = await bcrypt.hash(password, 10);

            const user = new User({
                name,
                email,
                password: hashPassword
            })


            user.save().then(user => {
                //login
                res.redirect('/')
            }).catch((error) => {
                req.flash('name', name)
                req.flash('email', email)
                req.flash('error', 'Something went wrong!')
                return res.redirect('/register')
            })
        },
        logout(req, res) {
            req.logout()
            return res.redirect('/login')
        }
    }
}

module.exports = authController