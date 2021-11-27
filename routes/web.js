const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customer/cartController')
const guest=require('../app/http/middlewares/guest')
function webRoutes(app) {
    app.get('/', homeController().index)
    
    app.get('/cart', cartController().index)
    app.post('/update-cart', cartController().update)
    
    app.get('/login',guest, authController().login)
    app.post('/login', authController().postLogin)

    app.get('/register',guest, authController().register)
    app.post('/register',authController().postRegister)

    app.post('/logout',authController().logout)
}

module.exports = webRoutes