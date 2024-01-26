const SubTask = require('../models/subtaskModel');
const { verifyToken } = require('../utils/authentication');

//creating subtasks
const createSubTask = async (req, res) => {
  try {
    const token = req.header('Authorization');
    const decodedToken = verifyToken(token.replace('Bearer ', ''));
    
    if (!decodedToken || !decodedToken.user_id) {
      return res.status(401).json({ error: 'Invalid or missing user_id in the token' });
    }

    const userId = decodedToken.user_id;
    const { task_id } = req.body;

    const subtask_id = generateRandomSubTaskId();
    
    const subTask = new SubTask({
      user_id: userId,
      task_id: task_id,
      subtask_id,
    });


    await subTask.save();

    res.status(201).json({ message: 'Subtask created successfully', subTask });
  } catch (err) {
    console.error('Error creating subtask:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const generateRandomSubTaskId = () => {
  return Math.floor(Math.random() * 10000);
};

//get all the subtask

const getSubTask = async (req,res)=>{
    try{
        
        const token = req.header('Authorization');
        const decodedToken= verifyToken(token.replace('Bearer ',''));
        if(!decodedToken || !decodedToken.user_id){
            res.status(404).json({error:'invalid or missing user id in the token'});
        }
        const userId= decodedToken.user_id;
        const {task_id}=req.body;
        const queryConditions={
            user_id:userId,
            task_id,
        };
        const subtasks=await SubTask.find(queryConditions);
        res.status(200).json({subtasks});

    }catch(err){
        console.log(err);
        res.status(500).json({message:'Internal Server Error'});
    }
};


const updateSubTask = async (req,res)=>{
  try{
    const token = req.header('Authorization');
    const decodedToken = verifyToken(token.replace('Bearer ', ''));

    if (!decodedToken || !decodedToken.user_id) {
      return res.status(401).json({ error: 'Invalid or missing user_id in the token' });
    }

    const userId = decodedToken.user_id;
    const { task_id, subtask_ids } = req.body;


    if (!Array.isArray(subtask_ids)) {
      return res.status(400).json({ error: 'subtask_ids should be an array' });
    }

    const updateConditions = {
      user_id: userId,
      task_id,
      subtask_id: { $in: subtask_ids },
      status: 0, // Only update subtasks with status 0
      deleted_at: null,
    };

    const updateResult = await SubTask.updateMany(updateConditions, { $set: { status: 1 } });

    return res.status(200).json({
      message: `Updated subtasks successfully`,
      updatedSubtasks: updateResult.nModified,
    });
  }catch(err){
    console.error('Error updating subtasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
//deleting subtask
const deleteSubTask= async (req,res)=>{
  try{
    const token = req.header('Authorization');
    const decodedToken = verifyToken(token.replace('Bearer ',''));
    if(!decodedToken || !decodedToken.user_id){
      return res.status(404).json({message:'User not Found'});
    }
    const userId=decodedToken.user_id;
    const {task_id,subtask_id}=req.body;
    const subTask=await SubTask.findOne({user_id:userId,task_id,subtask_id,deleted_at:null});
    if(!subTask){
      return res.status(404).json({error:'Subtask not Found'});
    }
    subTask.deleted_at=new Date();
    await subTask.save();
    return res.status(200).json({message:'Soft Deleted the Subtask'});
  }catch(error){
    console.error('Error deleting subtasks',error);
    res.status(500).json({error:'Internal Server Error'});
  }
};



//get the count of completed subtasks
const getCompeleteSubTaskStatus=async (user_id,task_id)=>{
    try{
        const count=await SubTask.countDocuments({user_id,task_id,status: 1});
        return count;
    }catch(error){
        console.log("Error Fetching the subtasks",error);
        throw error;
    }
}


module.exports = {
  createSubTask,
  getSubTask,
  getCompeleteSubTaskStatus,
  updateSubTask,
  deleteSubTask,
};
