import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  module: { type: String, required: true },
  menu: { type: String, required: true },
  story: { type: String, required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reportedDate: { type: Date, default: Date.now },
  description: { type: String, required: true },
  type: { type: String, enum: ['evolution', 'anomaly'], required: true },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    required: true 
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedDate: { type: Date },
  resolvedDateDev: { type: Date },
  deployOnServer: { type: Boolean, default: false },
  tester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  testDate: { type: Date },
  resolvedDateTester: { type: Date },
  status: { 
    type: String, 
    enum: [
      'todo', 
      'in_progress', 
      'done_pending', 
      'completed', 
      'testing', 
      'deployed'
    ], 
    required: true 
  },
  screenshots: [{ type: String }], // Array of screenshot URLs
  activityLog: [{ // Combined comments and change history
    type: { type: String, enum: ['comment', 'change'], required: true }, // Type of entry
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who made the entry
    content: { type: String, required: true }, // Comment or change description
    date: { type: Date, default: Date.now } // Timestamp
  }]
}, { timestamps: true });

const Task = mongoose.model('Task', TaskSchema);

export default Task;