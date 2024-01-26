const User = require('../models/userModel');
const {generateToken} =require('../utils/authentication');


const registerUser = async(req,res) => {
    try{
        const {user_id,phone_number,priority}=req.body;

        const checkExistingUser= await User.findOne({user_id});
        if(checkExistingUser){
            return res.status(400).json({error:'User with this id already exists'});
        }
        const checkExistingPhone_Number= await User.findOne({phone_number});
        if(checkExistingPhone_Number){
            return res.status(400).json({error:'User with same phone number eixsts'});
        }
        const newUser= new User({
            user_id,
            phone_number,
            priority,
        });
        await newUser.save();
        const token = generateToken(user_id);
        res.status(200).json({message:'User registered Suceess',token});
    }catch(err){
        console.log('error registering user',err);
        res.status(500).json({error:'Internal Server Error'});
    }
};

module.exports={
    registerUser,
};