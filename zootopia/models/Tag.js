import mongoose from "mongoose";

const TagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    group: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TagGroup",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Tag ||
  mongoose.model("Tag", TagSchema);