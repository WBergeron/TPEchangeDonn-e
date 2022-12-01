import mongoose from 'mongoose';
import { PLANET_NAMES } from '../data/constants.js';

const customerSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  planet: { type: String, enum: PLANET_NAMES },
  coord: {
    lat: { type: Number, min: -1000, max: 1000, required: true },
    lon: { type: Number, min: -1000, max: 1000, required: true },
  },
  phone: { type: String, max: 16 },
  birthday: { type: String, required: true },
  referalCode: { type: String }
}, {
  collection: 'customers',
  id: false,
});

customerSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'customer',
  justOne: false
});

export default mongoose.model('Customer', customerSchema);