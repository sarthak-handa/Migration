import mongoose from 'mongoose';

const AssemblySchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  serialNumber: { type: Number, required: true }, // 1,2,3...
  name: { type: String },
  subassemblies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subassembly' }],
  components: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Component' }],
  status: { type: String, enum: ['design', 'ordering', 'manufacturing', 'assembly', 'dispatch'], default: 'design' },
});

export default mongoose.models.Assembly || mongoose.model('Assembly', AssemblySchema);