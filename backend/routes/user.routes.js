const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const Resignation = require('../models/resignation.model');
const ExitResponse = require('../models/response.model');

// Submit resignation
router.post('/resign', auth, async (req, res) => {
    try {
        const resignation = await Resignation.create({
            employeeId: req.user._id,
            lwd: req.body.lwd,
        });
        res.json({ data: { resignation: { _id: resignation._id } } });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Submit exit responses
router.post('/responses', auth, async (req, res) => {
    try {
        await ExitResponse.create({
            employeeId: req.user._id,
            responses: req.body.responses
        });
        res.json({ message: 'Responses submitted' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
