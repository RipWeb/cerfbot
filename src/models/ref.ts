import { InferSchemaType, model, Schema } from "mongoose"

const refSchema = new Schema(
  {
    firstUsage: Date,
    lastUsage: Date,
    name: {
      index: true,
      type: String,
      unique: true
    },
    count: {
      default: 0,
      type: Number
    },
    countGroups: {
      default: 0,
      type: Number
    }
  }
)

export type IRef = InferSchemaType<typeof refSchema>

export const Ref = model("ref", refSchema)
