import { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await API.get('/dashboard');
        setData(data);
      } catch (err) {
        toast.error('Failed to load dashboard');
      }
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  const stats = data?.stats;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#1f2937', marginBottom: '2rem' }}>Dashboard</h1>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard title="Total Projects" value={stats?.totalProjects} color="#3b82f6" />
        <StatCard title="Total Tasks" value={stats?.totalTasks} color="#10b981" />
        <StatCard title="My Tasks" value={stats?.myTasks} color="#8b5cf6" />
        <StatCard title="Completed" value={stats?.completedTasks} color="#059669" />
        <StatCard title="Overdue" value={stats?.overdueTasks} color="#ef4444" />
      </div>

      {/* Recent Tasks */}
      <div style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#1f2937', marginBottom: '1rem' }}>Recent Tasks</h2>
        {data?.recentTasks?.length === 0 ? (
          <p style={{ color: '#6b7280' }}>Koi task nahi hai abhi</p>
        ) : (
          data?.recentTasks?.map(task => (
            <div key={task._id} style={{ padding: '0.75rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, fontWeight: '500', color: '#1f2937' }}>{task.title}</p>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>
                  {task.project?.name} • Assigned: {task.assignedTo?.name || 'Unassigned'}
                </p>
              </div>
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                background: task.status === 'done' ? '#d1fae5' : task.status === 'in_progress' ? '#dbeafe' : '#f3f4f6',
                color: task.status === 'done' ? '#065f46' : task.status === 'in_progress' ? '#1e40af' : '#374151'
              }}>
                {task.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderLeft: `4px solid ${color}` }}>
    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>{title}</p>
    <p style={{ margin: '0.5rem 0 0', fontSize: '2rem', fontWeight: 'bold', color }}>{value || 0}</p>
  </div>
);

export default Dashboard;