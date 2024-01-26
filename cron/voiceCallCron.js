require('dotenv').config();
const cron = require('node-cron');
const  twilio = require('twilio');
const Task= require('../models/taskModel'); 
const account_id=process.env.ACCOUNT_SID;
const auth_token= process.env.AUTH_TOKEN;
const phone=process.env.TWILIO_PHONE;
const client = twilio(account_id,auth_token);

cron.schedule('* * * * * *', async ()=>{
    const overdueTasks = await Task.find({ due_date: { $lt: new Date() } }).populate('user');

    // Group users by priority
    const usersByPriority = {};
    overdueTasks.forEach(task => {
      const priority = task.user.priority;
      if (!usersByPriority[priority]) {
        usersByPriority[priority] = [];
      }
      usersByPriority[priority].push(task.user);
    });
    
    // Iterate over priorities starting from 0
    for (let priority = 0; priority <= 2; priority++) {
      const usersToCall = usersByPriority[priority];
      if (usersToCall && usersToCall.length > 0) {
        // Make calls to users with the current priority
        await makeCalls(usersToCall);
      }
    }
    
    async function makeCalls(users) {
      // Iterate over users and initiate calls
      for (const user of users) {
        try {
          const call = await client.calls.create({
            to: user.phone_number,
            from: phone,
            url: "http://demo.twilio.com/docs/voice.xml", 
          });
    
          console.log(`Call initiated to ${user.phone_number} with Call SID: ${call.sid}`);
        } catch (error) {
          console.error(`Error calling ${user.phone_number}: ${error.message}`);

        }
      }
    }
});