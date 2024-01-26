
const express = require('express');
const router = express.Router();
const subTaskController = require('../controllers/subtaskController');

router.post('/create', subTaskController.createSubTask);
router.get('/',subTaskController.getSubTask);
router.put('/update',subTaskController.updateSubTask);
router.delete('/delete',subTaskController.deleteSubTask);

module.exports = router;
