'use client';

import { useEffect, useState } from 'react';

interface Task {
  id: number;
  title: string;
  description: string;
  status: boolean;
  due_date: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function TaskTrackerPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Fetch tasks async
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      console.log('Fetched tasks:', data); // Debug
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add new task
  const addTask = async () => {
    if (!title) return;
    try {
      await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, due_date: dueDate || null }),
      });
      setTitle('');
      setDescription('');
      setDueDate('');
      fetchTasks();
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  // Toggle task status
  const toggleStatus = async (id: number, status: boolean) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: !status }),
      });
      fetchTasks();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  // Delete task
  const deleteTask = async (id: number) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Daily Task Tracker</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: '8px', marginRight: '5px' }}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: '8px', marginRight: '5px' }}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ padding: '8px', marginRight: '5px' }}
        />
        <button onClick={addTask} style={{ padding: '8px' }}>Add Task</button>
      </div>

      <ul>
        {tasks.length === 0 ? (
          <li>No tasks yet.</li>
        ) : (
          tasks.map((task) => (
            <li key={task.id} style={{ marginBottom: '10px' }}>
              <strong>{task.title}</strong> - {task.description || ''} - Due: {task.due_date || 'N/A'} - 
              Status: <input
                type="checkbox"
                checked={task.status}
                onChange={() => toggleStatus(task.id, task.status)}
              />
              <button onClick={() => deleteTask(task.id)} style={{ marginLeft: '10px' }}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
