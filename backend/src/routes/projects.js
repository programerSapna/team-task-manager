const router = require('express').Router();
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const {
  getProjects, createProject, getProject,
  addMember, deleteProject, removeMember
} = require('../controllers/projectController');

router.get('/', auth, getProjects);
router.post('/', auth, createProject);
router.get('/:id', auth, getProject);
router.post('/:id/members', auth, checkRole, addMember);
router.delete('/:id/members/:userId', auth, checkRole, removeMember);
router.delete('/:id', auth, checkRole, deleteProject);

module.exports = router;