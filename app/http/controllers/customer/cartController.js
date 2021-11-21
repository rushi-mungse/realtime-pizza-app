function cartController(){
    return{
        index(req,res){
            res.render('customer/cart')
        }
    }
}

module.exports = cartController