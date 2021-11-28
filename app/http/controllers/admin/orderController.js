const Order = require('../../../models/order')
function orderController() {
    return {
        index(req, res) {
            Order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 } }).populate('customerId', '-password').exec((err, order) => {
                if (req.xhr) {
                    return res.json(order)
                }
                return res.render('admin/order')
            })
        },
    }
}

module.exports = orderController