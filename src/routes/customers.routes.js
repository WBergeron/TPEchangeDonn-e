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

import customerRepository from '../repositories/customer.repository.js';

// TODO: Importer le repository pour les fonctions de recherche

const router = express.Router();

class CustomerRoutes {
    // Nous sommes déjà sous le path /customers
    constructor() {
        // TODO: Déclarer votre ajout a l'adresse pour pointer vers votre méthode
        router.get('/:idCustomer', this.getOne);
        router.put('/:idCustomer', this.putOne);
        router.get('/', this.getAll);
        router.post('/', this.post)
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

    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    // Dev: William Bergeron
    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    async getAll(req, res, next) {
        try {
            const retrieveOptions = {
                skip: req.skip,
                limit: req.query.limit,
                planet: req.params.planet
            }

            let [customers, itemCount] = await customerRepository.retrieve(retrieveOptions);

            customers = customers.map(e => {
                e = e.toObject({ getters: false, virtuals: false });
                e = customerRepository.transform(e);
                return e;
            });
            const pageCount = Math.ceil(itemCount / req.query.limit)
            const hasNextPageFunction = paginate.hasNextPages(req);
            const hasNextPage = hasNextPageFunction(pageCount);

            const pagesLinksFunction = paginate.getArrayPages(req);
            const links = pagesLinksFunction(40, pageCount, req.query.page = 0);
            console.log(links);

            const payload = {
                _metadata: {
                    hasNextPage: hasNextPage,
                    page: req.query.page,
                    limit: req.query.limit,
                    skip: req.skip,
                    totalPages: pageCount,
                    totalDocuments: itemCount
                },
                _links: {
                    prev: `${process.env.BASE_URL}${links[0]}`,
                    self: `${process.env.BASE_URL}${links[1]}`,
                    next: `${process.env.BASE_URL}${links[2]}`

                },
                data: []
            }

            //Cas particulier de la première page
            if (req.query.page === 1) {
                payload._links.self = `${process.env.BASE_URL}${links[0]}`;
                payload._links.next = `${process.env.BASE_URL}${links[1]}`;
                delete payload._links.prev;
            }

            //Cas particulier de la dernière page
            if (!hasNextPage) {
                payload._links.prev = `${process.env.BASE_URL}${links[1]}`;
                payload._links.self = `${process.env.BASE_URL}${links[2]}`;
                delete payload._links.next;
            }

            res.status(200).json(payload);
        } catch (err) {
            next(err);
        }
    }

    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    // Dev: Hadrien Breton
    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    async post(req, res, next) {
        try {

            if (Object.keys(req.body).length === 0) {
                return next(HttpError.BadRequest('Le client ne peut pas contenir aucune donnée'));
            }

            //TODO: Erreur 409: Conflit (Lorsque le courriel existe déjà)

            let newCustomer = await customerRepository.create(req.body);
            newCustomer = newCustomer.toObject({ getters: false, virtuals: false });
            newCustomer = customerRepository.transform(newCustomer);

            if (req.params._body === "false") {
                res.status(204).end();
            }
            res.status(201).json(newCustomer);
        }
        catch (err) {
            next(err);
        }
    }
}

new CustomerRoutes();

export default router;