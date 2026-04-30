const Project = require('../models/Project');

module.exports = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const member = project.members.find(
      m => m.user.toString() === req.user.id
    );
    const isOwner = project.owner.toString() === req.user.id;

    if (!isOwner && (!member || member.role !== 'admin')) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    req.project = project;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};