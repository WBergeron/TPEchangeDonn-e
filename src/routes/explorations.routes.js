import express from 'express';
import paginate from 'express-paginate';
import HttpError from 'http-errors';

import explorationRepository from '../repositories/explorations.repository.js';

const router = express.Router(); 

class ExplorationsRoutes {
    
    constructor() {
        router.get('/', paginate.middleware(25,50), this.getAll);
        router.get('/:explorationId', this.getOne);
    }

    async getAll(req, res, next) {
        try {
 
            const retrieveOptions = {
                limit:req.query.limit,
                skip: req.skip
            }


            let [ explorations, itemCount ] = await explorationRepository.retrieve(retrieveOptions);

            explorations = explorations.map(e => {
                e = e.toObject({getters: false, virtuals:false});
                e = explorationRepository.transform(e);

                return e;
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
                data: explorations
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

    async getOne(req, res, next) {

        try {

            const retrieveOptions = {};
            if(req.query.embed && req.query.embed === 'planet') {
                retrieveOptions.planet = true;
            }

            const idExploration = req.params.explorationId;
            let exploration = await explorationRepository.retrieveById(idExploration, retrieveOptions);

            if(!exploration) {
                return next(HttpError.NotFound());
            }

            exploration = exploration.toObject({getters:false, virtuals:false});
            exploration = explorationRepository.transform(exploration, retrieveOptions);
            
            res.status(200).json(exploration);


        } catch(err) {
            return next(err);
        }
    }

}

new ExplorationsRoutes();

export default router;