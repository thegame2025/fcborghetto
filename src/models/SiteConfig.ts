import mongoose, { Schema, models } from 'mongoose';

const SiteConfigSchema = new Schema(
  {
    siteName: {
      type: String,
      default: 'FC Borghetto',
    },
    logo: {
      type: String,
    },
    logoPublicId: {
      type: String,
    },
    primaryColor: {
      type: String,
      default: '#1f2937', // Dark blue
    },
    secondaryColor: {
      type: String,
      default: '#ef4444', // Red
    },
    accentColor: {
      type: String,
      default: '#f59e0b', // Amber
    },
    // Home page content
    homeTitle: {
      type: String,
      default: 'Benvenuti nel sito del FC Borghetto',
    },
    homeDescription: {
      type: String,
      default: 'Una squadra di calcio con una grande passione per lo sport e la comunità.',
    },
    homeImage: {
      type: String,
    },
    homeImagePublicId: {
      type: String,
    },
    // Live streaming
    liveStreamUrl: {
      type: String,
      default: '',
    },
    liveStreamActive: {
      type: Boolean,
      default: false,
    },
    // Contatti
    address: {
      type: String,
      default: 'Via Roma 1, Borghetto, Italia',
    },
    email: {
      type: String,
      default: 'info@fcborghetto.it',
    },
    phone: {
      type: String,
      default: '+39 123 456 7890',
    },
    mapCoordinates: {
      lat: {
        type: Number,
        default: 45.4642,
      },
      lng: {
        type: Number,
        default: 9.1900,
      },
    },
    facebookUrl: {
      type: String,
      default: '',
    },
    instagramUrl: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const SiteConfig = models.SiteConfig || mongoose.model('SiteConfig', SiteConfigSchema);

export default SiteConfig; 