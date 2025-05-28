import mongoose, { Schema, models } from 'mongoose';

const PlayerSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Nome è obbligatorio'],
    },
    surname: {
      type: String,
      required: [true, 'Cognome è obbligatorio'],
    },
    role: {
      type: String,
      required: [true, 'Ruolo è obbligatorio'],
    },
    number: {
      type: Number,
    },
    image: {
      type: String,
    },
    imagePublicId: {
      type: String,
    },
    bio: {
      type: String,
    },
    seasonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Season',
      required: [true, 'Annata è obbligatoria'],
    },
  },
  { timestamps: true }
);

const Player = models.Player || mongoose.model('Player', PlayerSchema);

export default Player; 