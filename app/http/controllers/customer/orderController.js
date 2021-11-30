const Order = require('../../../models/order')
const moment = require('moment')
function orderController() {
    return {
        store(req, res) {
            const { phone, address } = req.body;
            if (!phone || !address) {
                req.flash('error', 'All fields are required!')
                return res.redirect('/cart')
            }
            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address,
            })

            order.save().then(result => {
                Order.populate(result, { path: 'customerId' }, (err, newOrder) => {
                    req.flash('success', 'order placed succesfully!')
                    delete req.session.cart;
                    // emit
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('orderPlaced', newOrder);
                    return res.redirect('/customer/order')
                })
            }).catch(err => {
                req.flash('error', 'Something went wring!')
                return res.redirect('/cart')
            })
        },
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id }, null, { sort: { 'createdAt': -1 } })
            return res.render('customer/order', { orders, moment })
        },
        async show(req, res) {
            const order = await Order.findById(req.params.id);
            res.render('customer/singleOrder', { order })
        }
    }
}

module.exports = orderController