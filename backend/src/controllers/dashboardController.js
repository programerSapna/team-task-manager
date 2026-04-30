const Task = require('../models/Task');
const Project = require('../models/Project');

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await Project.find({
      $or: [{ owner: userId }, { 'members.user': userId }]
    });
    const projectIds = projects.map(p => p._id);

    const totalTasks = await Task.countDocuments({ project: { $in: projectIds } });
    const myTasks = await Task.countDocuments({ assignedTo: userId });
    const completedTasks = await Task.countDocuments({
      project: { $in: projectIds }, status: 'done'
    });
    const inProgressTasks = await Task.countDocuments({
      project: { $in: projectIds }, status: 'in_progress'
    });
    const todoTasks = await Task.countDocuments({
      project: { $in: projectIds }, status: 'todo'
    });
    const overdueTasks = await Task.countDocuments({
      project: { $in: projectIds },
      dueDate: { $lt: new Date() },
      status: { $ne: 'done' }
    });

    // Tasks per user
    const tasksPerUser = await Task.aggregate([
      { $match: { project: { $in: projectIds }, assignedTo: { $exists: true } } },
      { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { name: '$user.name', count: 1 } }
    ]);

    const recentTasks = await Task.find({ assignedTo: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('project', 'name');

    res.json({
      stats: {
        totalTasks, myTasks, completedTasks,
        inProgressTasks, todoTasks,
        overdueTasks, totalProjects: projects.length
      },
      tasksPerUser,
      recentTasks
    });
  } catch (err) {
    console.error('DASHBOARD ERROR:', err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDashboard };