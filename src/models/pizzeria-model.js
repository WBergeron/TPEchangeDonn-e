import mongoose from 'mongoose';
import { PLANET_NAMES } from '../data/constants';
import { MONSTER_ANCESTORS } from '../data/constants';
import { PIZZA_TOPPINGS } from '../data/constants';

const pizzeriaSchema = mongoose.Schema({
    planet: {
        required: true,
        enum: PLANET_NAMES,
    },
    coord: {
        lon: { type: Number, required: true, min: -1000, max: 1000 },
        lat: { type: Number, required: true, min: -1000, max: 1000 }
    },
    chef: {
        name: { type: String, required: true },
        ancestor: { enum: MONSTER_ANCESTORS, required: true },
        speciality: { enum: PIZZA_TOPPINGS, required: true }
    }
}, {
    collection: 'pizzerias',
    id: false
});

export default mongoose.model('Pizzeria', pizzeriaSchema);