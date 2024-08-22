import mongoose, { InferSchemaType } from 'mongoose';
const { Schema } = mongoose;

const today = new Date(); 
const yesterday = new Date(today.setHours(today.getHours() - 24)); 

const userSchema = new Schema({
  id: { index: true, required: true, type: Number, unique: true },
  username: String,
  first_name: String,
  ref_name: { default: null, type: String},
  alive: { default: true, type: Boolean},
  dick_len: { default: 1, type: Number},
  last_fap: { default: yesterday, type: Date},
});

export type IUser = InferSchemaType<typeof userSchema>;

export const User = mongoose.model('user', userSchema);