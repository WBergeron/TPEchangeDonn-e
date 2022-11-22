import Planet from '../models/planet.model.js';
import objectToDotNotation from '../libs/objectToDotNotation.js';
import dayjs from 'dayjs';

const ZERO_KELVIN = -273.15;
class PlanetRepository {
    
    retrieveById(idPlanet, retrieveOptions) {
        const retrieveQuery = Planet.findById(idPlanet);

        if(retrieveOptions.explorations) {
            retrieveQuery.populate('explorations');
        }

        return retrieveQuery;
    }

    retrieveAll(filter) {
        return Planet.find(filter);
    }

    update(idPlanet, planetModifs) {

        const planetToDotNotation = objectToDotNotation(planetModifs);
        return Planet.findByIdAndUpdate(idPlanet, planetToDotNotation, {new:true});

    }

    delete(idPlanet) {
        return Planet.findByIdAndDelete(idPlanet);
    }

    create(planet) {
        return Planet.create(planet);
    }

    transform(planet, transformOptions = {}) {
        if(transformOptions) {
            if(transformOptions.unit === 'c') {
                planet.temperature += ZERO_KELVIN;
                planet.temperature = parseFloat(planet.temperature.toFixed(2));
            }
        }

        planet.discoveryDate = dayjs(planet.discoveryDate).format('YYYY-MM-DD');

        planet.lightspeed = 
            `${planet.position.x.toString(16)}@${planet.position.y.toString(16)}#${planet.position.z.toString(16)}`;

        planet.href = `${process.env.BASE_URL}/planets/${planet._id}`;    

        delete planet._id;
        delete planet.__v;

        return planet;
    }


}

export default new PlanetRepository();