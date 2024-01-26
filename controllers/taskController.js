const Task = require('../models/taskModel');
const SubTask=require('../models/subtaskModel');
const {verifyToken} =require('../utils/authentication');
const {getCompeleteSubTaskStatus}=require('./subtaskController');

//create task
const createTask =async (req,res)=>{
    try{
        const token = req.header('Authorization');
        const decodedToken = verifyToken(token.replace('Bearer ', ''));
        if (!decodedToken || !decodedToken.user_id) {
          return res.status(401).json({ error: 'Invalid or missing user_id in the token' });
        }

        const userId = decodedToken.user_id;
    
        const {title,description,due_date}=req.body;
        const task_id= generateRandomTaskId();

        const newTask= new Task({
            task_id,
            title,
            description,
            due_date,
            user_id:userId,
        });
        await newTask.save();
        res.status(201).json({message:'Task created', task:newTask});
    }catch(err){
        console.log('Error Creating Task',err);
        res.status(500).json({error:'Internal Server Error'});
    }
};

const generateRandomTaskId =()=>{
    return Math.floor(Math.random()*10000);
};

//get task

const getUserTasks = async (req, res) => {
    try {
      const token = req.header('Authorization');
      const decodedToken = verifyToken(token.replace('Bearer ', ''));
  
      if (!decodedToken || !decodedToken.user_id) {
        return res.status(401).json({ error: 'Invalid or missing user_id in the token' });
      }
  
      const userId = decodedToken.user_id;
      const { priority, due_date, page = 1, limit = 10 } = req.query;
  
      // Build query conditions based on filters
      const queryConditions = {
        user_id: userId,
      };
  
      if (priority) {
        queryConditions.priority = parseInt(priority);
      }
  
      if (due_date) {
        queryConditions.due_date = { $gte: new Date(due_date) };
      }
  
 
      const tasks = await Task.find(queryConditions)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ due_date: 'asc' }); // Change the sorting as per your requirement
  
      res.status(200).json({ tasks });
    } catch (err) {
      console.error('Error fetching user tasks:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  //updating the task accordingly
  const updateTask =async (req,res)=>{
    try{
      const token = req.header('Authorization');
      const decodedToken = verifyToken(token.replace('Bearer ', ''));
  
      if (!decodedToken || !decodedToken.user_id) {
        return res.status(401).json({ error: 'Invalid or missing user_id in the token' });
      }
  
      const userId = decodedToken.user_id;
      const {task_id,due_date}=req.body;
      const task= await Task.findOne({task_id:task_id});
      if(!task){
        return res.status(404).json({error:"Task Not Found"});
      }
      if (due_date !== undefined && due_date !== null) {
        task.due_date = due_date;
      }
      const queryConditions={
        user_id:userId,
        task_id,
        deleted_at: null,
    };
    // console.log(task);
    const completedSubtasks=await SubTask.find(queryConditions);
    const completedSubtasksCount = completedSubtasks.filter(subtask => subtask.status === 1).length;
    const totalSubtasksCount=completedSubtasks.length;
    task.status=updateTaskStatus(completedSubtasksCount,totalSubtasksCount);
    await task.save();
    return res.status(200).json({message:"Task Updated Succes",task});

    }catch(error){
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
    }
  };

  //deleting the tasks
  const deleteTask = async(req,res)=>{
    try {
      const token = req.header('Authorization');
      const decodedToken = verifyToken(token.replace('Bearer ', ''));

      if (!decodedToken || !decodedToken.user_id) {
          return res.status(401).json({ error: 'Invalid or missing user_id in the token' });
      }

      const userId = decodedToken.user_id;
      const { task_id } = req.body;

      const task = await Task.findOne({ user_id:userId,task_id, deleted_at: null });

      if (!task) {
          return res.status(404).json({ error: 'Task Not Found' });
      }

      // Soft delete the task by updating the deleted_at field
      task.deleted_at = new Date();
      await task.save();

      return res.status(200).json({ message: 'Task Soft-Deleted' });


    }catch(error){
      console.error('Error soft-deleting task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  const updateTaskStatus = (completedSubtasksCount, totalSubtasksCount) => {
    if (completedSubtasksCount === totalSubtasksCount) {
      return 'DONE';
    } else if (completedSubtasksCount > 0) {
      return 'IN_PROGRESS';
    } else {
      return 'TODO';
    }
  };


module.exports = {
    createTask,
    getUserTasks,
    updateTask,
    deleteTask,
};