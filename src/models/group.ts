import mongoose, { InferSchemaType } from 'mongoose';
const { Schema } = mongoose;

const groupSchema = new Schema({
  id: { index: true, required: true, type: Number, unique: true },
  username: String,
  title: String,
  totalDickLen: { default: 0, type: Number },
  membersQuantity: Number,
  alive: { default: true, type: Boolean}
});

export type IGroup = InferSchemaType<typeof groupSchema>

export const Group = mongoose.model('group', groupSchema);