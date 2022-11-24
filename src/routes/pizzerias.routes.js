///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
//  Dev: William Bergeron, Hadrien Breton, Julius Leblanc
//  Nom de Fichier: pizzerias.routes.js
//  Date de création: 23 novembre 2022
//  Date de modif:
//  Description: Méthodes qui effecturont les requêtes pour les pizzerias
///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///

import express from 'express';
import paginate from 'express-paginate';
import HttpError from 'http-errors';

import pizzeriaRepository from '../repositories/pizzeria.repository.js';

// TODO: Importer le repository pour les fonctions de recherche

const router = express.Router();

class PizzeriasRoutes {
    // Nous sommes déjà sous le path /pizzerias
    constructor() {
        // TODO: Déclarer votre ajout a l'adresse pour pointer vers votre méthode
        router.get('/', this.getAll);
        router.get('/:idPizzeria', this.getOne);
        router.post('/', this.post);
    }

    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    // Dev: William Bergeron
    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    async getOne(req, res, next) {
        try {
            const retrieveOptions = {};
            if (req.query.embed && req.query.embed === 'orders') {
                retrieveOptions.orders = true;
            }

            const idPizzeria = req.params.pizzeriaId;
            let pizzeria = await pizzeriaRepository.retrieveById(idPizzeria, retrieveOptions);

            if (!pizzeria) {
                return next(HttpError.NotFound(`La pizzeria avec l'identifiant ${req.params.pizzeriaId} n'existe pas`));
            }

            pizzeria = pizzeria.toObject({ getters: false, virtuals: false });
            pizzeria = pizzeriaRepository.transform(pizzeria, retrieveOptions);

            res.status(200).json(pizzeria);
        } catch (err) {
            next(err);
        }
    }
    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    // Dev: Julius Leblanc
    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    async post(req, res, next) {
        const newPizzeria = req.body;

        if (Object.keys(newPizzeria).length === 0) {
            return next(HttpError.BadRequest('La Pizzeria ne peut pas contenir aucune donnée'));
        }

        try {
            let pizzeriaAdded = await pizzeriaRepository.create(newPizzeria);
            pizzeriaAdded = pizzeriaAdded.toObject({ getters: false, virtuals: false });
            if (req.query._body === 'false') {
                return res.status(201).end();
            }
            pizzeriaAdded = pizzeriaRepository.transform(pizzeriaAdded);
            res.status(201).json(pizzeriaAdded);
        } catch (err) {
            return next(err);
        }
    }

    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    // Dev: Hadrien Breton
    ///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
    async getAll(req, res, next) {
        try {
            const displayOptions = {};
            if (req.query.page && parseInt(req.query.page) > 0) {
                displayOptions.page = req.query.page;
            } else {
                displayOptions.page = 1;
            }
            if (req.query.limit && parseInt(req.query.limit) > 0 && parseInt(req.query.limit) < 50) {
                displayOptions.limit = req.query.limit;
            } else {
                displayOptions.limit = 25;
            }
            let filter = "";
            if (req.query.speciality) {
                filter = req.query.speciality;
            }

            let pizzerias = await pizzeriaRepository.retrieveAll(filter);

            let i = 1;
            let pg = 1;
            pizzerias = pizzerias.map((p) => {
                p = p.toObject({ getters: false, virtuals: false });
                p = pizzeriaRepository.transform(p);

                if (i <= parseInt(displayOptions.limit) && pg == displayOptions.page) {
                    i++
                    if (i > parseInt(displayOptions.limit)) {
                        i = 1;
                        pg++;
                    }
                    return p;
                }
                i++;
                if (i > parseInt(displayOptions.limit)) {
                    i = 1;
                    pg++;
                }
            });
            pizzerias = pizzerias.filter(p => p);

            res.status(200).json(pizzerias);
        } catch (err) {
            next(err);
        }
    }

}

new PizzeriasRoutes();

export default router;