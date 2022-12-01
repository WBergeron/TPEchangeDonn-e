///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
//  Dev: William Bergeron, Hadrien Breton, Julius Leblanc
//  Nom de Fichier: orders.routes.js
//  Date de création: 01 décembre 2022
//  Date de modif:
//  Description: Méthodes qui effecturont les requêtes pour les orders
///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///

import express from 'express';
import paginate from 'express-paginate';
import HttpError from 'http-errors';

import orderRepository from '../repositories/order.repository.js';

// TODO: Importer le repository pour les fonctions de recherche

const router = express.Router();

class OrdersRoutes {
    // Nous sommes déjà sous le path /orders
    constructor() {
        // TODO: Déclarer votre ajout a l'adresse pour pointer vers votre méthode
        router.get('/', paginate.middleware(10,30), this.getAll);
    }

    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    // Dev: Julius Leblanc
    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    async getAll(req, res, next) {
        try {
 
            const retrieveOptions = {
                limit:req.query.limit,
                skip: req.skip,
                topping: req.query.topping
            }

            let [ orders, itemCount ] = await orderRepository.retrieve(retrieveOptions);
            orders = orders.map(o => {
                o = o.toObject({getters: false, virtuals:false});
                o = orderRepository.transform(o);
                return o;
            });

            const pageCount = Math.ceil(itemCount / req.query.limit)
            const hasNextPageFunction = paginate.hasNextPages(req);
            const hasNextPage = hasNextPageFunction(pageCount);

            const pagesLinksFunction = paginate.getArrayPages(req);
            const links = pagesLinksFunction(3, pageCount, req.query.page);
            console.log(links); 

            const payload = {
                _metadata: {
                    hasNextPage:hasNextPage, 
                    page: req.query.page,
                    limit: req.query.limit,
                    skip: req.skip,
                    totalPages: pageCount,
                    totalDocuments: itemCount
                },
                _links: {
                    prev:`${process.env.BASE_URL}${links[0].url}`,
                    self:`${process.env.BASE_URL}${links[1].url}`,
                    next:`${process.env.BASE_URL}${links[2].url}`

                },
                data: orders
            }

            //Cas particulier de la première page
            if(req.query.page === 1) {
                payload._links.self = `${process.env.BASE_URL}${links[0].url}`;
                payload._links.next = `${process.env.BASE_URL}${links[1].url}`;
                delete payload._links.prev;
            }

            //Cas particulier de la dernière page
            if(!hasNextPage) {
                payload._links.prev = `${process.env.BASE_URL}${links[1].url}`;
                payload._links.self = `${process.env.BASE_URL}${links[2].url}`;
                delete payload._links.next;
            }

            res.status(200).json(payload);
        } catch(err) {
            return next(err);
        }
    }

}

new OrdersRoutes();

export default router;