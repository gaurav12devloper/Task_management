import { Request, Response } from 'express';	
import asyncHandler from "../middleware/asyncHandler";
import TaskModel from '../models/taskModel';
import { IUser } from '../models/userModel';
import { trusted } from 'mongoose';

// @desc    Get all tasks of user
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async(req: CustomRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
    }
    const tasks = await TaskModel.find({ user: req.user._id });
    if (tasks.length > 0) {
        res.json(tasks);
    } else {
        res.status(404).json({ message: "No tasks found for this user" });
    }
});

// @desc  Create a task
// @route POST /api/tasks
// @access Private

interface CustomRequest extends Request {
    user?: IUser; // Add the user field (which could be undefined)
}
const createTask = asyncHandler(async(req: CustomRequest, res: Response)=>{
    const {title, description,status, priority, deadline}=req.body;
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
    }
    const userid=req.user._id;
    const task = new TaskModel({
        user: userid,
        title,
        description,
        status,
        priority,
        deadline    
    });
    const createdTask = await task.save();
    res.status(201).json({createdTask, message: "Task created successfully" });
});

// @desc    Edit a task
// @route   PUT /api/tasks/:id
// @access  Private
const editTask = asyncHandler(async(req:Request, res:Response)=>{
    const modify=await TaskModel.findById(req.params.id);
    if(modify){
        modify.title=req.body.title || modify.title;
        modify.description=req.body.description || modify.description;
        modify.status=req.body.status || modify.status;
        modify.priority=req.body.priority || modify.priority;
        modify.dueDate=req.body.dueDate || modify.dueDate;
        const updatedTask=await modify.save();
        res.json({success:true,updatedTask, message: "Task updated successfully"});
    }
    else{
        res.status(404);
        throw new Error("Task not found");
    }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async(req:Request, res:Response)=>{
    const task = await TaskModel.findById(req.params.id);
    if(task){
        await task.deleteOne({_id: task._id});  //delete the task
        res.json({message: "Task deleted successfully"});   
    }
    else{
        res.status(404);
        throw new Error("Task not found");
    }
});

export {getTasks, createTask, editTask, deleteTask};