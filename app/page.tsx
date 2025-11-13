'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  description: string;
  status: boolean;
  due_date: string | null;
}

const API_URL = 'https://daily-task-tracker-backend.onrender.com';

export default function TaskTrackerPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };
    fetchTasks();
  }, []);

  // Add new task
  const addTask = async () => {
    if (!title) return;
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, due_date: dueDate || null }),
      });
      setTitle('');
      setDescription('');
      setDueDate('');
      // Refresh tasks
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Error adding task:', err);
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
              <strong>{task.title}</strong> - {task.description || ''} - Due: {task.due_date || 'N/A'}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
