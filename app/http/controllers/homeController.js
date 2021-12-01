const Menu = require('../../models/menu')
function homeController() {

    return {
        async index(req, res) {
            const pizzas = await Menu.find(null, null, { sort: { 'createdAt': -1 } })
            res.render('home', { pizzas })
        }
    }
}

module.exports = homeController