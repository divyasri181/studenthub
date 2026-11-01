const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide an expense title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: ['Food', 'Travel', 'Shopping', 'Education', 'Entertainment', 'Others'],
        message: '{VALUE} is not a valid category',
      },
      default: 'Others',
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Cash', 'Debit Card', 'Credit Card', 'Net Banking'],
      default: 'UPI',
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [300, 'Notes cannot exceed 300 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast query by user and date
expenseSchema.index({ user: 1, date: -1 });

module.exports = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);
