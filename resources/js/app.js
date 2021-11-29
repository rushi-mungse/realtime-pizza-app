import axios from 'axios'
import Noty from 'noty'
import { initAdmin } from './admin';
import moment from 'moment';

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

//status update
let statuses = document.querySelectorAll('.status_line')
console.log(statuses);
let hiddenInput = document.querySelector('#hidden_input')
console.log(hiddenInput);
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time=document.createElement('small')
let date=document.createElement('small')

function updateStatus(order) {
    let stepCompleted = true;
    statuses.forEach((status) => {
        let dataProp = status.dataset.status
        if (stepCompleted) {
            status.classList.add('step-completed')
        }
        if (dataProp === order.status) {
            stepCompleted = false;
            time.innerText=moment(order.updatedAt).format('hh:mm A')
            date.innerText=moment(order.updatedAt).format('DD/MM/YYYY')
            
            status.appendChild(time)
            status.appendChild(date)
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')
            }
        }
    })
}

updateStatus(order)