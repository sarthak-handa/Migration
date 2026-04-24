import mongoose from 'mongoose';

const ComponentSchema = new mongoose.Schema({
  subassembly: { type: mongoose.Schema.Types.ObjectId, ref: 'Subassembly' },
  assembly: { type: mongoose.Schema.Types.ObjectId, ref: 'Assembly' },
  serialNumber: { type: String, required: true }, // 1.1.1, 1.1.2...
  name: { type: String },
  description: { type: String },
  quantity: { type: Number, default: 1 },
  status: { type: String, enum: ['design', 'ordering', 'manufacturing', 'assembly', 'dispatch'], default: 'design' },
  // Add more fields as per BOM
});

export default mongoose.models.Component || mongoose.model('Component', ComponentSchema);