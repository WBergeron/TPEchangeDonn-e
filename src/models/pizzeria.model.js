///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///
//  Dev: William Bergeron                                                    //
//  Nom de Fichier: pizzeria.model.js                                        //
//  Date de création: 22 novembre 2022                                       //
//  Date de modif:                                                           //
//  Description: Model d'une pizzeria enregistrer dans la base de donnée     //
///-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-///

import mongoose from 'mongoose';
import { PLANET_NAMES } from '../data/constants.js';
import { MONSTER_ANCESTORS } from '../data/constants.js';
import { PIZZA_TOPPINGS } from '../data/constants.js';

//------------------------------------------------------------------------
const pizzeriaSchema = mongoose.Schema({
    planet: {
        type: String,
        required: true,
        enum: PLANET_NAMES
    },
    coord: {
        lon: { type: Number, required: true, min: -1000, max: 1000 },
        lat: { type: Number, required: true, min: -1000, max: 1000 }
    },
    chef: {
        name: { type: String, required: true },
        ancestor: { type: String, enum: MONSTER_ANCESTORS, required: true },
        speciality: { type: String, enum: PIZZA_TOPPINGS, required: true }
    }
}, {
    collection: 'pizzerias',
    id: false
});

export default mongoose.model('Pizzeria', pizzeriaSchema);