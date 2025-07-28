const Resignation = require('../models/Resignation');
const ExitResponse = require('../models/ExitResponse');

// Get all resignations
exports.getAllResignations = async (req, res) => {
 try {
    const resignations = await Resignation.find()
      .populate('employeeId', 'username email');

    res.status(200).json({ data: resignations });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch resignations', error: err.message });
  }
};

// Approve or reject resignation
exports.concludeResignation = async (req, res) => {
  const { resignationId, approved, lwd } = req.body;

  const resignation = await Resignation.findById(resignationId);
  if (!resignation) {
    return res.status(404).json({ message: 'Resignation not found' });
  }

  resignation.status = approved ? 'approved' : 'rejected';
  resignation.lwd = lwd;
  await resignation.save();

  res.status(200).json({ message: `Resignation ${resignation.status}` });
};

// Get all exit responses
exports.getAllExitResponses = async (req, res) => {
  const responses = await ExitResponse.find();
  res.status(200).json({ data: responses });
};
