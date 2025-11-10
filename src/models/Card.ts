import { Schema, model, models, Types } from "mongoose";

const CardSchema = new Schema(
  {
    projectId: { type: Types.ObjectId, ref: "Project", index: true, required: true },
    className: { type: String, required: true, trim: true },
    responsibilities: { type: [String], default: [], validate: (v: string[]) => v.length >= 1 },
    collaborators:   { type: [String], default: [], validate: (v: string[]) => v.length >= 1 },
    attributes:      { type: [String], default: [] },
    methods:         { type: [String], default: [] },
    issueFlags:      [{ category: String, severity: String, message: String }],
  },
  { timestamps: true }
);

export default models.Card || model("Card", CardSchema);
