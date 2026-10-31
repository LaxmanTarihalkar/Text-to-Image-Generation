const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    prompt: {
      type: String,
      required: [true, 'Prompt is required'],
      trim: true,
      maxlength: [1000, 'Prompt cannot exceed 1000 characters'],
    },
    enhancedPrompt: {
      type: String,
      default: '',
    },
    style: {
      type: String,
      enum: ['realistic', 'anime', '3d', 'cartoon', 'cyberpunk', 'fantasy', 'abstract'],
      default: 'realistic',
    },
    imageUrl: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      default: 1024,
    },
    height: {
      type: Number,
      default: 1024,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    reportCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for faster queries
imageSchema.index({ userId: 1, createdAt: -1 });
imageSchema.index({ prompt: 'text' });

module.exports = mongoose.model('Image', imageSchema);
