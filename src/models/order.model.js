///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
//  Dev: Hadrien Breton                                                      //
//  Nom de Fichier: order.model.js                                           //
//  Date de création: 22 novembre 2022                                       //
//  Description: Model d'une commande enregistrée dans la base de donnée     //
///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///

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
        toppings: [{ type: String, enum: PIZZA_TOPPINGS, required: true }],
        id: false,
        _id: false
    }]
}, {
    collection: 'orders',
    id: false,
    strict: 'throw'
});


export default mongoose.model('Order', orderSchema);