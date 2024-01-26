const mongoose = require('../utils/database');

const taskSchema = new mongoose.Schema({
  task_id: {
    type: Number,
    unique: true,
    required: true,
  },
  user_id:{
    type:Number,
    required:true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  due_date: {
    type: Date,
    required: true,
  },
  priority: {
    type: Number,
    enum:[0,1,2,3],
    default:0,
  },
  status:{
    type:String,
    enum:["TODO","IN_PROGRESS","DONE"],
    default:"TODO",
  },
  deleted_at:{
    type:Date,
    default:null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
