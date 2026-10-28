import mongoose from "mongoose";

const rsvpSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    phone: { type: String, trim: true, maxlength: 20 },
    attending: { type: Boolean, required: true },
    guests: { type: Number, min: 1, max: 10, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("Rsvp", rsvpSchema);
