const Order = require('../../../models/order')

function statusController() {

    return {
        index(req, res) {
            Order.updateOne({ _id: req.body.orderId }, { status: req.body.status }, (err, data) => {
                if (err) {
                    res.redirect('/admin/order')
                }
                res.redirect('/admin/order')
            })
        }
    }
}

module.exports = statusController