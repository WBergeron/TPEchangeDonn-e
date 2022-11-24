import mongoose from 'mongoose';
import { PIZZA_SIZES, PIZZA_TOPPINGS } from '../data/constants.js'

const orderSchema = mongoose.Schema({
    pizzeria: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Pizzeria'
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Customer'
    },
    orderDate: { type: Date, default: Date.now, required: true },
    pizzas: [{
        size: { type: String, enum: PIZZA_SIZES, required: true },
        price: Number,
        topping: { type: String, enum: PIZZA_TOPPINGS, required: true },
    }]
}, {
    collection: 'orders',
    id: false,
    strict: 'throw'
});


export default mongoose.model('Order', orderSchema);