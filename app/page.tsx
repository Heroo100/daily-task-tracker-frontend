'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

type Task = {
  id: string; // ✅ Schimbat din number în string pentru UUID
  title: string;
  completed: boolean;
  created_at: string;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Înlocuiește cu URL-ul tău real de pe Render
  const API_URL = 'https://daily-task-tracker-backend.onrender.com/api';

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get<Task[]>(`${API_URL}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;
    try {
      setError('');
      await axios.post(`${API_URL}/tasks`, { title });
      setTitle('');
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError('Failed to add task');
    }
  };

  const toggleTask = async (id: string) => { // ✅ string în loc de number
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    try {
      setError('');
      await axios.put(`${API_URL}/tasks/${id}`, { completed: !task.completed });
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError('Failed to update task');
    }
  };

  const deleteTask = async (id: string) => { // ✅ string în loc de number
    try {
      setError('');
      await axios.delete(`${API_URL}/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
      setError('Failed to delete task');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ Handler pentru Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: '0 auto' }}>
      <h1>Daily Task Tracker</h1>

      {error && (
        <div style={{ color: 'red', marginBottom: 10, padding: 8, background: '#fee' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', marginBottom: 16 }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="New task"
          style={{ flex: 1, marginRight: 8, padding: 8 }}
          disabled={loading}
        />
        <button onClick={addTask} disabled={loading}>
          {loading ? 'Loading...' : 'Add'}
        </button>
      </div>

      {loading && tasks.length === 0 ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>No tasks yet. Add one!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: 8,
                padding: 8,
                background: '#f5f5f5',
                borderRadius: 4
              }}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                style={{ marginRight: 8 }}
              />
              <span
                style={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                  flex: 1,
                  color: task.completed ? '#999' : '#000'
                }}
              >
                {task.title}
              </span>
              <button 
                onClick={() => deleteTask(task.id)} 
                style={{ 
                  marginLeft: 8,
                  background: '#ff4444',
                  color: 'white',
                  border: 'none',
                  padding: '4px 12px',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}