import { Schema, model, models, Types } from "mongoose";

const MemberSchema = new Schema(
  { userId: { type: Types.ObjectId, required: true }, role: { type: String, enum: ["owner","editor","viewer"], default: "owner" } },
  { _id: false }
);

const ProjectSchema = new Schema(
  { ownerId: { type: Types.ObjectId, required: false }, name: { type: String, required: true, trim: true }, description: { type: String, default: "" }, members: { type: [MemberSchema], default: [] } },
  { timestamps: true }
);

export default models.Project || model("Project", ProjectSchema);
