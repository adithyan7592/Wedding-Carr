import mongoose from "mongoose";

const wishSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    message: { type: String, required: true, trim: true, maxlength: 280 },
  },
  { timestamps: true }
);

export default mongoose.model("Wish", wishSchema);
