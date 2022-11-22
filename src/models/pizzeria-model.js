import mongoose from 'mongoose';

const pizzeriaSchema = mongoose.Schema({

    planet: {
        required: true,
        name: String,
    },
    coord: {
        lon: { type: Number, required: true, min: -1000, max: 1000 },
        lat: { type: Number, required: true, min: -1000, max: 1000 }
    },
    chef: {
        name: { type: String, required: true },

    }
}, {
    collection: 'explorations',
    id: false
});

export default mongoose.model('Pizzeria', pizzeriaSchema);