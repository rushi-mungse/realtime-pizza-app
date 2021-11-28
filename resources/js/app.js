import axios from 'axios'
import Noty from 'noty'
import { initAdmin } from './admin';
const addToCart = document.querySelectorAll('.add_to_cart');
const cartCounter = document.querySelector('.cart_counter');

const updateCart = async (pizza) => {
    try {
        const cart = await axios.post('/update-cart', pizza);
        cartCounter.innerText = cart.data.totalQty
        new Noty({
            text: 'Item added to cart successfully...',
            type: 'success',
            timeout: 500,
            progressBar: false,
        }).show();
    } catch (error) {
        new Noty({
            text: 'Something went wrong!',
            type: 'error',
            timeout: 500,
            progressBar: false,
        }).show();
    }
}
addToCart.forEach(btn => {
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pozza);
        updateCart(pizza)
    })
})

const alertMsg = document.querySelector('#success-alert')
if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 1000);
}

initAdmin()