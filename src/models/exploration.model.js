import mongoose from 'mongoose';

const explorationSchema = mongoose.Schema({

    explorationDate: { type: Date, default: Date.now, required:true },
    planet:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Planet'
    },
    coord: {
        lon: Number,
        lat: Number
    },
    scans: [{
        element: String,
        percent: Number,
        _id:false
    }],
    comment: String
}, {
    collection: 'explorations',
    id:false
});

export default mongoose.model('Exploration', explorationSchema);