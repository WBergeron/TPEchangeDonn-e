import { PLANET_NAMES } from '../data/constants.js'
import expressValidator from 'express-validator';
const { body } = expressValidator;

///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
// Dev: William Bergeron
///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
class CustomersValidators {
    complete() {
        return [
            body('name').exists().withMessage('Requis').bail(),
            body('email').exists().withMessage('Requis et unique').bail(),
            body('planet').exists().withMessage('Requis').bail().isIn(PLANET_NAMES).withMessage('La planet existe pas').bail(),
            body('coord.lat').exists().withMessage('lat doit exister').bail().isFloat({ min: -1000, max: 1000 }).withMessage('La latitude doit être compris entre -1000 et 1000').bail(),
            body('coord.lon').exists().withMessage('lon doit exister').bail().isFloat({ min: -1000, max: 1000 }).withMessage('La longeur doit être compris entre -1000 et 1000').bail(),
            body('phone').exists().withMessage('Requis').bail().isHexadecimal().withMessage('Doit être un nom Hexadecimal').bail(),
        ];
    }
}

export default new CustomersValidators();