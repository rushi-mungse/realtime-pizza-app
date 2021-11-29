const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customer/cartController')
const orderController = require('../app/http/controllers/customer/orderController')
const adminOrderController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')

const guest = require('../app/http/middlewares/guest')
const auth = require('../app/http/middlewares/auth')
const admin=require('../app/http/middlewares/admin')

function webRoutes(app) {
    app.get('/', homeController().index)

    app.get('/cart', cartController().index)
    app.post('/update-cart', cartController().update)

    app.get('/login', guest, authController().login)
    app.post('/login', authController().postLogin)

    app.get('/register', guest, authController().register)
    app.post('/register', authController().postRegister)

    app.post('/logout', authController().logout)

    app.post('/order', auth, orderController().store)
    app.get('/customer/order', auth, orderController().index)
    app.get('/customer/order/:id', auth, orderController().show)

    app.get('/admin/order', admin, adminOrderController().index)
    app.post('/admin/order/status', admin, statusController().index)

}

module.exports = webRoutes