const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const Resignation = require('../models/resignation.model');
const ExitResponse = require('../models/response.model');

// View all resignations
router.get('/resignations', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const data = await Resignation.find();
    res.json({ data });
});

// Approve/reject resignation
router.put('/conclude_resignation', auth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const { resignationId, approved, lwd } = req.body;
    const status = approved ? 'approved' : 'rejected';

    await Resignation.findByIdAndUpdate(resignationId, { status, lwd });
    res.json({ message: `Resignation ${status}` });
});

// View all exit questionnaire responses
router.get('/exit_responses', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const responses = await ExitResponse.find().populate('employeeId', 'username email');
    res.status(200).json({ data: responses });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch responses', error: err.message });
  }
});


module.exports = router;
