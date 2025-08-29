import { Schema, model, Document, Types } from "mongoose";

export interface IPantryItem extends Document {
  userId: Types.ObjectId;
  name: string;
  unit: "kg" | "g" | "l" | "ml" | "pcs" | "dozen" | "packet" | string;
  qty: number;
  tags?: string[];
  updatedAt?: Date;
}

const PantrySchema = new Schema<IPantryItem>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    // ✅ allow all units your UI uses
    unit: {
      type: String,
      enum: ["kg", "g", "l", "ml", "pcs", "dozen", "packet"],
      default: "pcs",
    },
    qty: { type: Number, default: 0, min: 0 },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

// helpful index so upserts by (userId,name) are fast
PantrySchema.index({ userId: 1, name: 1 }, { unique: false });

export const PantryItem = model<IPantryItem>("PantryItem", PantrySchema);
