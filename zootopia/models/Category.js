import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true, // Niezbędne do ładnych linków np. domena.pl/sklep/pies/karma-sucha
      trim: true,
      lowercase: true,
    },
    // Relacja rodzic-dziecko. 
    // Jeśli parent to null -> to jest główny dział (Pies, Kot, Małe zwierzęta)
    // Jeśli parent ma ID -> to jest podkategoria (Karma sucha, Akcesoria itp.)
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);