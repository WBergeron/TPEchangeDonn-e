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

// TODO: Importer le repository pour les fonctions de recherche

const router = express.Router();

class PizzeriasRoutes {
    // Nous sommes déjà sous le path /pizzerias
    constructor() {
        // TODO: Déclarer votre ajout a l'adresse pour pointer vers votre méthode
        router.get('/:idPizzeria', this.getOne);
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
            let pizzeria = await pizzeriasRepository.retrieveById(idPizzeria, retrieveOptions);

            if (!pizzeria) {
                return next(HttpError.NotFound(`La pizzeria avec l'identifiant ${req.params.pizzeriaId} n'existe pas`));
            }

            pizzeria = pizzeria.toObject({ getters: false, virtuals: false });
            pizzeria = pizzeriasRepository.transform(pizzeria, retrieveOptions);

            res.status(200).json(pizzeria);
        } catch (err) {
            next(err);
        }
    }

}

new PizzeriasRoutes();

export default router;