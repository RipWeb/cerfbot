import mongoose, { InferSchemaType } from 'mongoose';
const { Schema } = mongoose;

const groupUserSchema = new Schema({
  user_id: { required: true, type: Number },
  group_id: { required: true, type: Number },
});

export type IGroup = InferSchemaType<typeof groupUserSchema>

export const GroupUser = mongoose.model('groupuser', groupUserSchema);