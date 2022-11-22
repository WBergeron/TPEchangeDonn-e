import mongoose from 'mongoose';

const planetSchema = mongoose.Schema({
    name: {type: String, required:true, unique: true},
    discoveredBy : {type: String, index:true, required:true },
    discoveryDate: Date,
    temperature:Number,
    satellites:[String],
    position: {
        x: {type:Number, required:true, min:-1000, max:1000},
        y: {type:Number, required:true, min:-1000, max:1000},        
        z: {type:Number, required:true, min:-1000, max:1000},
    }
},
{
    collection:'planets',
    strict:'throw',
    timestamps:true,
    //versionKey: false
});

export default mongoose.model('Planet', planetSchema);