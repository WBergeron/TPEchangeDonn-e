///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
//  Dev: William Bergeron, Hadrien Breton, Julius Leblanc
//  Nom de Fichier: customer.routes.js
//  Date de création: 24 novembre 2022
//  Date de modif:
//  Description: Méthodes qui initialise les fonction des différente routes. 
///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///

import express from 'express';
import paginate from 'express-paginate';
import HttpError from 'http-errors';

import customerRepository from '../repositories/customer.respitory.js';

// TODO: Importer le repository pour les fonctions de recherche

const router = express.Router();

class CustomerRoutes {
    // Nous sommes déjà sous le path /customers
    constructor() {
        // TODO: Déclarer votre ajout a l'adresse pour pointer vers votre méthode
        router.get('/:idCustomer', this.getOne);
        router.put('/:idCustomer', this.putOne);
    }

    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    // Dev: Julius Leblanc
    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    async getOne(req, res, next) {
        try {
            const retrieveOptions = {};
            if (req.query.embed && req.query.embed === 'orders') {
                retrieveOptions.orders = true;
            }

            const customerId = req.params.idCustomer;
            let customer = await customerRepository.retrieveById(customerId, retrieveOptions);

            if (!customer) {
                return next(HttpError.NotFound(`Le customer avec l'identifiant ${req.params.idCustomer} n'existe pas`));
            }

            customer = customer.toObject({ getters: false, virtuals: false });
            customer = customerRepository.transform(customer, retrieveOptions);

            res.status(200).json(customer);
        } catch (err) {
            next(err);
        }
    }

    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    // Dev: William Bergeron
    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    async putOne(req, res, next) {
        try {
            const newCustomer = req.body;
            let customer = await customerRepository.update(req.params.idCustomer, newCustomer);

            if (!customer) {
                res.status(404).end();
                return next(HttpError.NotFound(`Le customer avec l'id ${req.params.idCustomer} n'existe pas`));
            }

            customer = customer.toObject({ getters: false, virtuals: false });
            customer = customerRepository.transform(customer);

            if (req.query._body === 'false') {
                return res.status(204).end();
            }

            res.status(200).json(customer);
        } catch (err) {
            next(err);
        }
    }
}

new CustomerRoutes();

export default router;