const mongoose = require('../utils/database');
const Task= require('./taskModel');

const subtaskSchema=new mongoose.Schema({
    subtask_id:{
        type:Number,
        unique:true,
        required:true,
    },
    user_id:{
        type:Number,
        required:true,
    },
    task_id:{
        type:Number,
        ref:`Task`,
        required:true,
    },
    status:{
        type:Number,
        enum:[0,1],
        default:0,
    },
    created_at:{
        type:Date,
        default:Date.now,
    },
    updated_at:{
        type:Date,
        default:Date.now,
    },
    deleted_at:{
        type:Date,
        default:null,
    },
});
module.exports = mongoose.model('Subtask',subtaskSchema);