import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  module: { type: String, required: true },
  menu: { type: String, required: true },
  story: { type: String, required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
  reportedDate: { type: Date, default: Date.now }, // Date remontée
  description: { type: String, required: true }, // Description de la réserve
  type: { type: String, enum: ['evolution', 'anomaly'], required: true }, // Type (evolution/anomalie)
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], // Enum for priority
    required: true 
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the User model
  assignedDate: { type: Date }, // Date assign
  resolvedDateDev: { type: Date }, // Date resolu (dev)
  deployOnServer: { type: Boolean, default: false }, // Deployer sur serveur
  tester: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the User model
  testDate: { type: Date }, // Date test
  resolvedDateTester: { type: Date }, // date resolu (Testeur)
  status: { 
    type: String, 
    enum: [
      'todo', 
      'in_progress', 
      'done_pending', 
      'completed', 
      'testing', 
      'deployed'
    ], // Enum for status with all development statuses
    required: true 
  },
  comment: { type: String }, // Commentaire
}, { timestamps: true });

const Task = mongoose.model('Task', TaskSchema);

export default Task;