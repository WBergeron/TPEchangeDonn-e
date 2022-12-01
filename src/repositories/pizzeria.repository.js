///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
//  Dev: William Bergeron, Hadrien Breton, Julius Leblanc
//  Nom de Fichier: pizzerias.repository.js
//  Date de création: 23 novembre 2022
//  Date de modif:
//  Description: Fonction qui recupère l'information selon les paramètres
///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///

import Pizzeria from '../models/pizzeria.model.js';

class PizzeriaRepository {
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
    // Dev: Hadrien Breton
    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    retrieveAll(filter) {
        if (filter !== "") {
            return Pizzeria.find({ "chef.speciality": filter });
        }
        return Pizzeria.find();

    }

    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    // Dev: William Bergeron / Julius Leblanc
    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    transform(pizzeria, retrieveOptions = {}) {
        // Accorder avec la personne qui prog ordersRepository pour la suite...
        //?embed=orders
        if (retrieveOptions.orders) {
            pizzeria.orders = ordersRepository.transform(pizzeria.orders);
        }
        else {
            // Il a pas order si yer pas dans le retrieveOptions
            // On veut tu quand même faire un href pour rien???
            pizzeria.orders = { href: `${process.env.BASE_URL}/pizzerias/${pizzeria._id}/orders` }
        }
        // Créer se qu'on veut renvoyer au client de plus
        pizzeria.href = `${process.env.BASE_URL}/pizzerias/${pizzeria._id}`;
        pizzeria.lightspeed = `[${pizzeria.planet}]@(${pizzeria.coord.lat};${pizzeria.coord.lat})]`;
        // Enlever se que le client veut pas
        delete pizzeria._id;
        delete pizzeria.__v;
        return pizzeria;
    }

    create(pizzeria) {
        return Pizzeria.create(pizzeria);
    }

}

export default new PizzeriaRepository();