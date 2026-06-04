
import mongoose from 'mongoose';

const DiscountCodeSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true, 
    trim: true 
  },
  type: { 
    type: String, 
    enum: ['percentage', 'fixed'],
    required: true 
  },
  value: { 
    type: Number, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  expiresAt: { 
    type: Date, 
    required: false 
  },
  usageLimit: {
    type: Number,
    required: false 
  },
  usageCount: {
    type: Number,
    default: 0 
  }
}, { timestamps: true });

export default mongoose.models.DiscountCode || mongoose.model('DiscountCode', DiscountCodeSchema);