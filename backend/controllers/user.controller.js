const Resignation = require('../models/Resignation');
const ExitResponse = require('../models/ExitResponse');

// Submit resignation
exports.submitResignation = async (req, res) => {
  const { lwd } = req.body;

  if (!lwd) return res.status(400).json({ message: 'Last working day is required' });

  const resignation = await Resignation.create({
    employeeId: req.user.userId,
    lwd,
    status: 'pending',
  });

  res.status(200).json({ data: { resignation: { _id: resignation._id } } });
};

// Submit exit questionnaire
exports.submitExitResponse = async (req, res) => {
  const { responses } = req.body;

  if (!responses || !Array.isArray(responses) || responses.length === 0) {
    return res.status(400).json({ message: 'Responses required' });
  }

  await ExitResponse.create({
    employeeId: req.user.userId,
    responses,
  });

  res.status(200).json({ message: 'Responses submitted' });
};
