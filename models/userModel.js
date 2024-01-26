const mongoose = require('../utils/database');

const userSchema=new mongoose.Schema({
    user_id:{
        type:Number,
        unique:true,
        required:true,
    },
    phone_number:{
        type:Number,
        required:true,
    },
    priority:{
        type:Number,
        enum:[0,1,2],
        default:0,
    },
});
module.exports=mongoose.model('User',userSchema);