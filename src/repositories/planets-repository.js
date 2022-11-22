import dayjs from 'dayjs';
import planetModel from '../models/planet-model.js';

import Planet from '../models/planet-model.js';

const ZERO_KELVIN = -273.15;

class PlanetsRepository {
  retrieveAll(filter = {}) {

    const filterSansWhere = {};
    const testFiltre = { discoveredBy: 'Skadex' }; //Where discoveredBy = 'Skadex'
    const testFiltreAnd = { temperature: { $gt: 240 }, 'position.y': { $lt: 500 } }; //($lt <) ($gt >) ($lte <=) ($gte >=)
    const testFiltreOr = { $or: [{ temperature: { $gt: 240 }, 'position.y': { $lt: 500 } }] };

    return Planet.find(filter); //SELECT * FROM planets
  }

  retrieveOne(idPlanet) {
    return Planet.findById(idPlanet); //SELECT * FROM planets WHERE idPlanet = [idPlanet]
  }

  create(planet) {
    return Planet.create(planet); // INSERT () INTO planets VALUES()
  }

  delete(idPlanet) {
    return Planet.findByIdAndDelete(idPlanet);
  }

  transform(planet, transformsOptions = {}) {
    if (transformsOptions) {
      //Changer les unités
      if (transformsOptions.unit === 'c') {
        planet.temperature += ZERO_KELVIN;
      }
    }

    //TODO: TP - HexMatrix - Karine Moreau
    this.calculateHexMatrix()

    //TODO: TP - Wind Direction - Karine Moreau

    planet.discoveryDate = dayjs(planet.discoveryDate).format('YYYY-MM-DD');

    delete planet.createdAt;
    delete planet.updatedAt;
    delete planet.__v;

    return planet;
  }

  calculateHexMatrix(hexMatrix) {

  }
}

export default new PlanetsRepository();
