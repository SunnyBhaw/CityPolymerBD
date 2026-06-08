import mongoose from 'mongoose';

const aboutUsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    mission: {
      type: String,
      trim: true,
    },
    vision: {
      type: String,
      trim: true,
    },
    values: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const AboutUs = mongoose.model('AboutUs', aboutUsSchema);

export default AboutUs;
