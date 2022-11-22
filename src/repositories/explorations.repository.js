import Exploration from '../models/exploration.model.js';

import planetRepository from './planet.repository.js';

class ExplorationsRepository {
    
    retrieveAll() {
        return Exploration.find();
    }

    retrieve(retrieveOptions) {
        const retrieveQuery = Exploration.find()
                                .limit(retrieveOptions.limit)
                                .skip(retrieveOptions.skip);

        return Promise.all([ retrieveQuery, Exploration.countDocuments() ]);
    }

    retrieveById(idExploration, retrieveOptions) {

        const retrieveQuery = Exploration.findById(idExploration);

        if(retrieveOptions.planet) {
            retrieveQuery.populate('planet');
        }

        return retrieveQuery;
    }

    transform(exploration, retrieveOptions = {}) {
        
        //?embed=planet
        if(retrieveOptions.planet) {
            exploration.planet = planetRepository.transform(exploration.planet);

        } else {
            exploration.planet = { href: `${process.env.BASE_URL}/planets/${exploration.planet._id}` }
        }

        exploration.href = `${process.env.BASE_URL}/explorations/${exploration._id}`;
        delete exploration._id;
        return exploration;
    }


}

export default new ExplorationsRepository();