import mongoose from 'mongoose';

const planetSchema = mongoose.Schema({
    name:{type: String, unique:true, required:true },
    discoveredBy: {type: String, index:true},
    discoveryDate: Date,
    temperature: Number,
    satellites:[String],
    position:{
        x: {type: Number, min:-1000, max:1000, required:true},
        y: {type: Number, min:-1000, max:1000, required:true},
        z: {type: Number, min:-1000, max:1000, required:true}
    }
},{
  collection:'planets',
  strict:'throw'
});

planetSchema.virtual('explorations', {
  ref:'Exploration',
  localField: '_id',
  foreignField: 'planet',
  justOne: false
});

export default mongoose.model('Planet', planetSchema);