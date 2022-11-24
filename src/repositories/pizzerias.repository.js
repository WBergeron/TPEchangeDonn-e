///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
//  Dev: William Bergeron, Hadrien Breton, Julius Leblanc
//  Nom de Fichier: pizzerias.repository.js
//  Date de création: 23 novembre 2022
//  Date de modif:
//  Description: Fonction qui recupère l'information selon les paramètres
///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///

import Pizzeria from '../models/pizzeria.model.js';

class PizzeriasRepository {

    /*
    retrieveAll() {
        return Exploration.find();
    }

    retrieve(retrieveOptions) {
        const retrieveQuery = Exploration.find()
            .limit(retrieveOptions.limit)
            .skip(retrieveOptions.skip);

        return Promise.all([retrieveQuery, Exploration.countDocuments()]);
    }
    */

    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    // Dev: William Bergeron
    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    retrieveById(idPizzeria, retrieveOptions) {
        // Avoir la pizzeria avec l'id passer en paramètre
        const retrieveQuery = Pizzeria.findById(idPizzeria);
        // Si l'emblem orders est la
        if (retrieveOptions.orders) {
            retrieveQuery.populate('order');
        }

        return retrieveQuery;
    }

    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    // Dev: William Bergeron
    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    transform(pizzeria, retrieveOptions = {}) {
        // Accorder avec la personne qui prog ordersRepository pour la suite...
        //?embed=orders
        if (retrieveOptions.orders) {
            pizzeria.orders = ordersRepository.transform(pizzeria.orders);
        } else {
            // TODO Vérifier le "orders._id"
            pizzeria.orders = { href: `${process.env.BASE_URL}/orders/${pizzeria.orders._id}` }
        }
        // Créer se qu'on veut renvoyer au client de plus
        pizzeria.href = `${process.env.BASE_URL}/pizzerias/${pizzeria._id}`;
        pizzeria.lightspeed = `[${pizzeria.planet}@(${pizzeria.coord.lat};${pizzeria.coord.lat})]`;
        // Enlever se que le client veut pas
        delete pizzeria._id;
        return pizzeria;
    }
}

export default new PizzeriasRepository();