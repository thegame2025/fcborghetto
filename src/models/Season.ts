import mongoose, { Schema, models } from 'mongoose';

const SeasonSchema = new Schema(
  {
    year: {
      type: String,
      required: [true, 'Anno è obbligatorio'],
      unique: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    imagePublicId: {
      type: String,
    },
  },
  { timestamps: true }
);

const Season = models.Season || mongoose.model('Season', SeasonSchema);

export default Season; 