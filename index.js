require('dotenv').config();
const express = require('express');
const mongoose = require('./utils/database');
const bodyParser = require('body-parser');
const userRoutes= require('./routes/userRoute');
const taskRoutes= require('./routes/taskRoute');
const subTaskRoutes=require('./routes/subtaskRoute');
const app = express();

app.use(bodyParser.json());

app.use('/api/users',userRoutes);
app.use('/api/tasks/',taskRoutes);
app.use('/api/subtasks/',subTaskRoutes)

mongoose.connection.on('connected', () => {

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });

  mongoose.connection.on('error', (err) => {
    console.error('Error connecting to the database:', err);
  });