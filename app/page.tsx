'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

type Task = {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');

  // Pune aici URL-ul backend-ului Render
  const API_URL = 'https://my-backend.onrender.com';

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get<Task[]>(`${API_URL}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Add new task
  const addTask = async () => {
    if (!title.trim()) return;
    try {
      await axios.post(`${API_URL}/tasks`, { title });
      setTitle('');
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle completed
  const toggleTask = async (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    try {
      await axios.put(`${API_URL}/tasks/${id}`, { completed: !task.completed });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete task
  const deleteTask = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
  const loadTasks = async () => {
    try {
      const res = await axios.get<Task[]>(`${API_URL}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  loadTasks();
}, []);


  return (
    <div style={{ padding: 20, maxWidth: 500, margin: '0 auto' }}>
      <h1>Daily Task Tracker</h1>

      <div style={{ display: 'flex', marginBottom: 16 }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task"
          style={{ flex: 1, marginRight: 8, padding: 4 }}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}
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
              }}
            >
              {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)} style={{ marginLeft: 8 }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
