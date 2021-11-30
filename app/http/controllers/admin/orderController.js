const Order = require('../../../models/order')
const Product = require('../../../models/menu')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: (req, res, cb) => cb(null, 'uploads/'),
    filename: (req, file, cd) => {
        const uniquePath = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cd(null, uniquePath)
    }
})

const handleMultipartData = multer({ storage, limits: { filesize: 1000000 * 5 } }).single('image');


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
        updateMenu(req, res) {
            res.render('admin/update-menu')
        },

        async addMenu(req, res, next) {
            handleMultipartData(req, res, async (err) => {
                if (err) {
                    console.log(err.message);
                }

                const { name, price, size } = req.body

                let filepath;
                if (req.file) {
                    filepath = req.file.path.replace('\\', '/')
                }

                if (!name || !price || !size || !filepath) {
                    req.flash('error', 'All fields are required')
                    req.flash('name', name)
                    req.flash('priice', price)
                    req.flash('size', size)

                    if (req.file) {
                        fs.unlink(`${appRoot}/${filepath}`, (err) => {
                            req.flash('error', 'Something went wrong!')
                        })
                    }
                    return res.redirect('/admin/update-menu')
                }
                try {
                    await Product.create({
                        name,
                        price,
                        image: filepath,
                        size
                    })
                } catch (error) {
                    console.log(error);
                }
                return res.redirect('/')
            })
        }
    }
}

module.exports = orderController