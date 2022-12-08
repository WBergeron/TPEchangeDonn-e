import { PLANET_NAMES, MONSTER_ANCESTORS, PIZZA_TOPPINGS } from '../data/constants.js'
import expressValidator from 'express-validator';
const { body } = expressValidator;

class PizzeriaValidators {
    complete() {
        return [
            body('planet').exists().withMessage('Requis').bail().isIn(PLANET_NAMES).withMessage('La planet existe pas').bail(),
            body('coord.lat').exists().withMessage('lat doit exister').bail().isFloat({ min: -1000, max: 1000 }).withMessage('La latitude doit être compris entre -1000 et 1000'),
            body('coord.lon').exists().withMessage('lon doit exister').bail().isFloat({ min: -1000, max: 1000 }).withMessage('La longeur doit être compris entre -1000 et 1000'),
            body('chef.name').exists().withMessage('Requis').bail(),
            body('chef.ancestor').exists().withMessage('Requis').bail().isIn(MONSTER_ANCESTORS).withMessage('Le monstre ancestor existe pas').bail(),
            body('chef.speciality').exists().withMessage('Requis').bail().isIn(PIZZA_TOPPINGS).withMessage('La speciality existe pas').bail()
        ];
    }
}

export default new PizzeriaValidators();