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


//status update
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hidden_input')

let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')
let date = document.createElement('small')

function updateStatus(order) {
    let stepCompleted = true;
    statuses.forEach((status)=>{
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    statuses.forEach((status) => {
        let dataProp = status.dataset.status
        if (stepCompleted) {
            status.classList.add('step-completed')
             if (status.nextElementSibling) {
                status.nextElementSibling.classList.remove('current')
            }
        }
        if (dataProp === order.status) {
            stepCompleted = false;
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            date.innerText = moment(order.updatedAt).format('DD/MM/YYYY')
            
            status.appendChild(time)
            status.appendChild(date)
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')
            }
        }
    })
}


updateStatus(order)
initAdmin()
// socket connection
const socket = io()
if (order) {
    socket.emit('join', `order_${order._id}`)
}

// let adminPath=window.location.pathname
// if(adminPath.includes('admin')){
//     initAdmin()
//     socket.emit('join','adminRoom')
// }

socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
      new Noty({
            text: 'Order Updated',
            type: 'success',
            timeout: 500,
            progressBar: false,
        }).show();
})