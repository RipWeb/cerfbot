import mongoose, { InferSchemaType } from 'mongoose';
const { Schema } = mongoose;

const charSchema = new Schema({
  id: { index: true, required: true, type: Number, unique: true },
  name: String,
  health: Number,
  damage: Number,
  armor: Number,
});

export type IChar = InferSchemaType<typeof charSchema>;

export const Char = mongoose.model('char', charSchema);