///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
//  Dev: William Bergeron, Hadrien Breton, Julius Leblanc
//  Nom de Fichier: customer.repository.js
//  Date de création: 24 novembre 2022
//  Date de modif:
//  Description: Fonction qui recupère l'information selon les paramètres
///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///

import dayjs from 'dayjs';
import Customer from '../models/customer.model.js';
import orderRepository from './order.repository.js';
import objectToDotNotation from '../libs/objectToDotNotation.js';

class CustomerRepository {

    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    // Dev: William Bergeron
    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    retrieve(retrieveOptions) {
        let retrieveQuery;
        if (retrieveOptions.planet) {
            retrieveQuery = Customer.find({ 'planet': retrieveOptions.planet })
                .limit(retrieveOptions.limit)
                .skip(retrieveOptions.skip)
                .sort({ birthday: 1 });

        } else {
            retrieveQuery = Customer.find()
                .limit(retrieveOptions.limit)
                .skip(retrieveOptions.skip)
                .sort({ birthday: 1 });
        }
        return Promise.all([retrieveQuery, Customer.countDocuments()]);
    }


    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    // Dev: Julius Leblanc
    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    retrieveById(idCustomer, retrieveOptions) {
        // Avoir la pizzeria avec l'id passer en paramètre
        const retrieveQuery = Customer.findById(idCustomer);
        // Si l'emblem orders est la
        if (retrieveOptions.orders) {
            retrieveQuery.populate('orders');
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
            console.log(customer);
            customer.orders = customer.orders.map((o) => {
                o = orderRepository.transform(o);
                return o;
            });
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
        let maintenant = dayjs(new Date());
        customer.age = maintenant.diff(customer.birthday, 'y');
        delete customer._id;
        delete customer.__v;
        return customer;
    }
    transformPhone(phone) {
        return "[" + phone.substring(0, 4) + "]" + phone.substring(4, 8) + "-" + phone.substring(8, 14) + "@" + phone.substring(14, 16);
    }

    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    // Dev: William Bergeron
    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    update(idCustomer, customerModif) {
        const customerToDotNotation = objectToDotNotation(customerModif);
        return Customer.findByIdAndUpdate(idCustomer, customerToDotNotation, { new: true });
    }

    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    // Dev: Hadrien Breton
    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    create(customer) {
        return Customer.create(customer);
    }

}

export default new CustomerRepository();