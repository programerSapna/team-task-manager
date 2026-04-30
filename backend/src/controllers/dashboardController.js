const Task = require('../models/Task');
const Project = require('../models/Project');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await Project.find({
      $or: [{ owner: userId }, { 'members.user': userId }]
    });
    const projectIds = projects.map(p => p._id);

    const totalTasks = await Task.countDocuments({ project: { $in: projectIds } });
    const myTasks = await Task.countDocuments({ 
      project: { $in: projectIds },
      assignedTo: userId 
    });
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

    // Recent tasks — project ke saare tasks dikhao
    const recentTasks = await Task.find({ 
      project: { $in: projectIds } 
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('project', 'name')
      .populate('assignedTo', 'name');

    res.json({
      stats: {
        totalTasks, myTasks, completedTasks,
        inProgressTasks, todoTasks,
        overdueTasks, totalProjects: projects.length
      },
      recentTasks
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};