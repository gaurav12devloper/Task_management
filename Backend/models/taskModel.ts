import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "user" },
    title: { type: String, required: true, trim: true },    
    description: { type: String, trim: true },
    status: { 
        type: String, 
        enum: ["TODO", "INPROGRESS", "COMPLETED"],
        default: "TODO",
     },
     priority: { 
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Low",
     },
     dueDate: { type: Date},
},
{
    timestamps: true
});

const TaskModel = mongoose.model("task", taskSchema);
export default TaskModel;