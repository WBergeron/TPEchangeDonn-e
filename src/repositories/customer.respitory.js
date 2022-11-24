///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
//  Dev: William Bergeron, Hadrien Breton, Julius Leblanc
//  Nom de Fichier: customer.repository.js
//  Date de création: 24 novembre 2022
//  Date de modif:
//  Description: Fonction qui recupère l'information selon les paramètres
///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///

import Customer from '../models/customer.model.js';

class CustomerRepository {


    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    // Dev: Julius Leblanc
    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    retrieveById(idCustomer, retrieveOptions) {
        // Avoir la pizzeria avec l'id passer en paramètre
        const retrieveQuery = Customer.findById(idCustomer);
        // Si l'emblem orders est la
        if (retrieveOptions.orders) {
            retrieveQuery.populate('order');
        }

        return retrieveQuery;
    }

    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    // Dev: Julius Leblanc
    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    transform(customer, retrieveOptions = {}) {
        // Accorder avec la personne qui prog ordersRepository pour la suite...
        //?embed=orders
        if (retrieveOptions.orders) {
            customer.orders = ordersRepository.transform(customer.orders);
        }
        else {
            // Il a pas order si yer pas dans le retrieveOptions
            customer.orders = { href: `${process.env.BASE_URL}/customers/${customer._id}/orders` }
        }
        customer.phone = this.transformPhone(customer.phone);
        // Créer se qu'on veut renvoyer au client de plus
        customer.href = `${process.env.BASE_URL}/customers/${customer._id}`;
        customer.lightspeed = `[${customer.planet}@(${customer.coord.lat};${customer.coord.lat})]`;
        // Enlever se que le client veut pas
        delete customer._id;
        delete customer.__v;
        return customer;
    }
    transformPhone(phone) {
        return "[" + phone.substring(0, 4) + "]" + phone.substring(4, 8) + "-" + phone.substring(8, 14) + "@" + phone.substring(14, 16);
    }

}

export default new CustomerRepository();