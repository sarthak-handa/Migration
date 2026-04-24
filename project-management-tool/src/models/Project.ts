import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  plannedStart: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  division: { type: String },
  label: { type: String },
  description: { type: String },
  projectFile: { type: String }, // Path to uploaded .sl file
  excelFile: { type: String }, // Path to uploaded .xlsx file
  assemblies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assembly' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);