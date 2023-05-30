import { Schema, model, models } from "mongoose";

const deskSchema = new Schema(
  {
    name: String,
    gameplay: Schema.Types.Mixed, // GameplayType
  },
  { timestamps: true }
);

const Desk = models.Desk || model("Desk", deskSchema);

export default Desk;
