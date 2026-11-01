const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    month: {
      type: String, // Format: YYYY-MM
      required: true,
    },
    totalBudget: {
      type: Number,
      required: [true, 'Please provide a monthly budget amount'],
      min: [0, 'Budget cannot be negative'],
    },
    categoryBudgets: {
      Food: { type: Number, default: 0 },
      Travel: { type: Number, default: 0 },
      Shopping: { type: Number, default: 0 },
      Education: { type: Number, default: 0 },
      Entertainment: { type: Number, default: 0 },
      Others: { type: Number, default: 0 },
    },
    alertThreshold: {
      type: Number,
      default: 80, // Alert at 80% usage
      min: 50,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

budgetSchema.index({ user: 1, month: 1 }, { unique: true });

module.exports = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);
