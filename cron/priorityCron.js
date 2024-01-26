const cron = require('node-cron');
const Task = require('../models/taskModel');
require('dotenv').config();
const cc=cron.schedule('* * * * * *', async () => {
  try {

    const tasks = await Task.find({ due_date: { $exists: true, $ne: null } });


    tasks.forEach(async (task) => {
      const currentDate = new Date();
      const dueDate = new Date(task.due_date);

      const timeDifference = dueDate.getTime() - currentDate.getTime();
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

      String
      if (daysDifference === 0) {
        task.priority = 0;
      } else if (daysDifference <= 2) {
        task.priority = 1;
      } else if (daysDifference <= 4) {
        task.priority = 2;
      } else {
        task.priority = 3;
      }


      await task.save();
    });

    console.log('Task priorities updated successfully');
  } catch (error) {
    console.error('Error updating task priorities:', error);
  }
});


cc.start();
