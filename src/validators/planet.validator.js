import expressValidator from 'express-validator';
const { body } = expressValidator;

// {
//     "position": {
//         "x": -601.0399968038633,
//         "y": -323.0355050920306,
//         "z": 689.5334013549557
//     },
//     "name": "Neon 5",
//     "discoveredBy": "Yiznik",
//     "discoveryDate": "2017-12-02",
//     "temperature": 280,
//     "satellites": [
//         "Funshaa"
//     ],
//     "lightspeed": "-259.0a3d3b0489a@-143.0916dc991ce#2b1.888cfdbf2d4",
//     "href": "http://localhost:5000/planets/5f1ef4071d2fd12580bf11ce"
// }

class PlanetValidators {
  complete() {
    return [
      body('name').exists().withMessage('Requis'),
      body('discoveredBy').exists().withMessage('Requis'),
      body('discoveryDate').exists().withMessage('Requis').isISO8601({ strict: true }).withMessage('doit être une date ISO8601').bail().isBefore(new Date().toISOString()).withMessage('doit être dans le passé'),
      body('temperature').exists().withMessage('Requis').bail(),
      body('satellites').exists().isArray().bail(),
      body('position.x').exists().withMessage('x doit exister').bail(),
      body('position.y').exists().withMessage('y doit exister').bail(),
      body('position.z').exists().withMessage('z doit exister').bail(),
      ...this.partial()
    ];
  }

  partial() {
    return [
        body('name').optional().isLength({ min: 5, max: 16 }).withMessage('Le nom de la planète doit être compris entre 5 et 16 caractères'), 
        body('position.x').optional().isFloat({ min: -1000, max: 1000 })
    ];
  }
}

export default new PlanetValidators();
