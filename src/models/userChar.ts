import mongoose, { InferSchemaType } from 'mongoose';
const { Schema } = mongoose;

const userCharSchema = new Schema({
  user_id: { required: true, type: Number },
  char_id: { required: true, type: Number },
  name: String,
  health: Number,
  damage: Number,
  armor: Number,
  xp: { type: Number, default: 5 },
  spent_xp: { type: Number, default: 0 }
});

export type IChar = InferSchemaType<typeof userCharSchema>;

export const UserChar = mongoose.model('userChar', userCharSchema);