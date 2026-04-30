import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import TaskModal from '../components/TaskModal';
import { useAuth } from '../context/AuthContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberForm, setMemberForm] = useState({ email: '', role: 'member' });
  const [editTask, setEditTask] = useState(null);

  const fetchData = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        API.get(`/projects/${id}`),
        API.get(`/tasks?projectId=${id}`)
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      toast.error('Failed to load project data');
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleStatusChange = async (taskId, status) => {
    try {
      await API.patch(`/tasks/${taskId}/status`, { status });
      toast.success('Status updated!');
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      toast.success('Task deleted!');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/projects/${id}/members`, memberForm);
      toast.success('Member added!');
      setMemberForm({ email: '', role: 'member' });
      setShowAddMember(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  const currentMember = project?.members?.find(
    m => m.user?._id === user?.id || m.user?._id === user?._id
  );
  const isAdmin = currentMember?.role === 'admin' ||
    project?.owner?._id === user?.id ||
    project?.owner?._id === user?._id;

  const currentUserId = user?.id || user?._id;

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: '#1f2937', margin: 0 }}>{project?.name}</h1>
          <p style={{ color: '#6b7280', margin: '0.25rem 0 0' }}>{project?.description}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {isAdmin && (
            <button
              onClick={() => setShowAddMember(!showAddMember)}
              style={{ padding: '0.75rem 1.5rem', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              + Add Member
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => { setEditTask(null); setShowTaskModal(true); }}
              style={{ padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              + Add Task
            </button>
          )}
        </div>
      </div>

      {/* Add Member Form */}
      {showAddMember && isAdmin && (
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0 }}>Add Member</h3>
          <form onSubmit={handleAddMember} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Email</label>
              <input
                type="email"
                value={memberForm.email}
                onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                required
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Role</label>
              <select
                value={memberForm.role}
                onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px' }}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Add
            </button>
          </form>
        </div>
      )}

      {/* Members */}
      <div style={{ background: 'white', padding: '1rem 1.5rem', borderRadius: '8px', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3 style={{ margin: '0 0 0.75rem' }}>Members</h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {project?.members?.map(m => (
            <div key={m._id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.75rem', background: m.role === 'admin' ? '#dbeafe' : '#f3f4f6', borderRadius: '20px' }}>
              <span style={{ color: m.role === 'admin' ? '#1e40af' : '#374151', fontSize: '0.85rem' }}>
                {m.user?.name} ({m.role})
              </span>
              {isAdmin && m.role !== 'admin' && (
                <button
                  onClick={async () => {
                    if (!window.confirm(`Are you sure you want to remove ${m.user?.name}?`)) return;
                    try {
                      await API.delete(`/projects/${id}/members/${m.user?._id}`);
                      toast.success('Member removed!');
                      fetchData();
                    } catch (err) {
                      toast.error(err.response?.data?.message || 'Failed to remove member');
                    }
                  }}
                  style={{ background: '#ef4444', border: 'none', cursor: 'pointer', color: 'white', fontWeight: '500', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Kanban Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <KanbanColumn title="Todo" tasks={todoTasks} color="#f3f4f6" titleColor="#374151"
          onStatusChange={handleStatusChange} onDelete={handleDeleteTask}
          onEdit={(task) => { setEditTask(task); setShowTaskModal(true); }}
          isAdmin={isAdmin} currentUserId={currentUserId} />
        <KanbanColumn title="In Progress" tasks={inProgressTasks} color="#dbeafe" titleColor="#1e40af"
          onStatusChange={handleStatusChange} onDelete={handleDeleteTask}
          onEdit={(task) => { setEditTask(task); setShowTaskModal(true); }}
          isAdmin={isAdmin} currentUserId={currentUserId} />
        <KanbanColumn title="Done" tasks={doneTasks} color="#d1fae5" titleColor="#065f46"
          onStatusChange={handleStatusChange} onDelete={handleDeleteTask}
          onEdit={(task) => { setEditTask(task); setShowTaskModal(true); }}
          isAdmin={isAdmin} currentUserId={currentUserId} />
      </div>

      {/* Task Modal */}
      {showTaskModal && isAdmin && (
        <TaskModal
          projectId={id}
          members={project?.members}
          editTask={editTask}
          onClose={() => { setShowTaskModal(false); setEditTask(null); }}
          onSave={() => { setShowTaskModal(false); setEditTask(null); fetchData(); }}
        />
      )}
    </div>
  );
};

const KanbanColumn = ({ title, tasks, color, titleColor, onStatusChange, onDelete, onEdit, isAdmin, currentUserId }) => (
  <div style={{ background: color, borderRadius: '8px', padding: '1rem' }}>
    <h3 style={{ color: titleColor, margin: '0 0 1rem', display: 'flex', justifyContent: 'space-between' }}>
      {title} <span style={{ background: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>{tasks.length}</span>
    </h3>
    {tasks.map(task => {
      const canUpdate = isAdmin || task.assignedTo?._id === currentUserId;
      return (
        <div key={task._id} style={{ background: 'white', borderRadius: '6px', padding: '1rem', marginBottom: '0.75rem', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
          <p style={{ margin: '0 0 0.5rem', fontWeight: '500', color: '#1f2937' }}>{task.title}</p>
          {task.description && <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#6b7280' }}>{task.description}</p>}
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', color: '#9ca3af' }}>
            Assigned: {task.assignedTo?.name || 'Unassigned'}
          </p>
          {task.dueDate && (
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', color: new Date(task.dueDate) < new Date() ? '#ef4444' : '#6b7280' }}>
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
          )}
          <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: task.priority === 'high' ? '#fee2e2' : task.priority === 'medium' ? '#fef3c7' : '#f0fdf4', color: task.priority === 'high' ? '#dc2626' : task.priority === 'medium' ? '#d97706' : '#16a34a' }}>
            {task.priority}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
            {canUpdate ? (
              <select
                value={task.status}
                onChange={(e) => onStatusChange(task._id, e.target.value)}
                style={{ flex: 1, padding: '0.4rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.8rem' }}
              >
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            ) : (
              <span style={{ flex: 1, padding: '0.4rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '0.8rem', color: '#6b7280' }}>
                {task.status === 'in_progress' ? 'In Progress' : task.status === 'done' ? 'Done' : 'Todo'}
              </span>
            )}
            {isAdmin && (
              <>
                <button onClick={() => onEdit(task)} style={{ padding: '0.4rem 0.75rem', background: '#f3f4f6', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>✏️</button>
                <button onClick={() => onDelete(task._id)} style={{ padding: '0.4rem 0.75rem', background: '#fee2e2', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>🗑️</button>
              </>
            )}
          </div>
        </div>
      );
    })}
  </div>
);

export default ProjectDetail;