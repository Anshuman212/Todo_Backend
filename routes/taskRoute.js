
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/create', taskController.createTask);
router.get('/',taskController.getUserTasks);
router.put('/update',taskController.updateTask);
router.delete('/delete',taskController.deleteTask);


module.exports = router;
