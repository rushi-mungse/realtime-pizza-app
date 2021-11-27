const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')

function authController() {
    return {
        login(req, res) {
            res.render('auth/login')
        },
        postLogin(req, res, next) {
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
                    res.redirect('/')
                })
            })(req, res, next)
        },
        register(req, res) {
            res.render('auth/register')
        },

        async postRegister(req, res) {
            const { name, email, password } = req.body;
            req.flash('name', name)
            req.flash('email', email)
            if (!name || !email || !password) {
                req.flash('error', 'All fields are required')
                res.redirect('/register')
            }
            const exist = await User.exists({ email })

            if (exist) {
                req.flash('name', name)
                req.flash('email', email)
                req.flash('error', 'Email already registered')
                res.redirect('/register')
            }
            const hashPassword = await bcrypt.hash(password, 10);

            const user = new User({
                name,
                email,
                password: hashPassword
            })


            user.save().then(user => {
                res.redirect('/')
            }).catch((error) => {
                req.flash('name', name)
                req.flash('email', email)
                req.flash('error', 'Something went wrong!')
                res.redirect('/register')
            })
        },
        logout(req,res){
            req.logout()
            return res.redirect('/login')
        }
    }
}

module.exports = authController