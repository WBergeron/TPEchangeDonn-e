///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
//  Dev: William Bergeron, Hadrien Breton, Julius Leblanc
//  Nom de Fichier: order.repository.js
//  Date de création: 01 décembre 2022
//  Date de modif:
//  Description: Fonction qui recupère l'information selon les paramètres
///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///

import Order from '../models/order.model.js';
import pizzeriaRepository from './pizzeria.repository.js';
import customerRepository from './customer.repository.js';

class OrderRepository {
    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    // Dev: Julius Leblanc
    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    retrieve(retrieveOptions) {
        let retrieveQuery;
        if (retrieveOptions.topping) {
            retrieveQuery = Order.find({'pizzas.toppings': retrieveOptions.topping})
            .limit(retrieveOptions.limit)
            .skip(retrieveOptions.skip)
            .sort({orderDate: 1}); 
        }else{
            retrieveQuery = Order.find()
            .limit(retrieveOptions.limit)
            .skip(retrieveOptions.skip)
            .sort({orderDate: 1});
        }
        return Promise.all([ retrieveQuery, Order.countDocuments() ]);

    }

    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    // Dev: Julius Leblanc
    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    transform(order, retrieveOptions = {}) {
        if (retrieveOptions.pizzeria) {
            order.pizzeria = pizzeriaRepository.transform(order.pizzeria);
        }
        if (retrieveOptions.customer) {
            order.customer = customerRepository.transform(order.customer);
        }
        order.subTotal = 0;
        order.pizzas.forEach(p => {
            order.subTotal += p.price;         
        });
        order.taxeRates = 0.0087;
        order.taxes = order.subTotal * order.taxeRates;
        order.total = order.subTotal + order.taxes;
        order.taxes = order.taxes.toFixed(3);
        order.total = order.total.toFixed(3);
        order.subTotal = order.subTotal.toFixed(3);
        // Enlever se que le client veut pas
        delete order._id;
        delete order.__v;
        return order;
    }

}

export default new OrderRepository();