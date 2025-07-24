// Call Routes
const express = require('express');
const router = express.Router();
const callController = require('../controllers/callController');

// Save a new call record
router.post('/log', callController.logCall);

// Get all call records
router.get('/all', callController.getAllCalls);

// Get call details by ID
router.get('/:id', callController.getCallById);

// Delete a call record
router.delete('/:id', callController.deleteCall);

module.exports = router;
