import mongoose from 'mongoose';

const SubassemblySchema = new mongoose.Schema({
  assembly: { type: mongoose.Schema.Types.ObjectId, ref: 'Assembly', required: true },
  serialNumber: { type: String, required: true }, // 1.1, 1.2...
  name: { type: String },
  components: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Component' }],
  bom: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BOMItem' }], // Bill of Materials
  status: { type: String, enum: ['design', 'ordering', 'manufacturing', 'assembly', 'dispatch'], default: 'design' },
});

export default mongoose.models.Subassembly || mongoose.model('Subassembly', SubassemblySchema);