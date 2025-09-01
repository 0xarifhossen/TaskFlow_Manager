import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './index.css';

const API_URL = 'http://localhost:5000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');

  // Fetch tasks
  const fetchTasks = async () => {
    const res = await axios.get(`${API_URL}/tasks`);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!text.trim()) return;
    await axios.post(`${API_URL}/tasks`, { text });
    setText('');
    fetchTasks();
    Swal.fire({ icon: 'success', title: 'Task added!', confirmButtonText: 'OK' });
  };

  const toggleComplete = async (task) => {
    await axios.put(`${API_URL}/tasks/${task._id}`, {
      text: task.text,
      completed: !task.completed,
    });
    fetchTasks();
  };

  const editTask = async (task) => {
    const { value: newText } = await Swal.fire({
      title: 'Edit Task',
      input: 'text',
      inputValue: task.text,
      showCancelButton: true,
      confirmButtonText: 'OK',
    });

    if (newText && newText.trim()) {
      await axios.put(`${API_URL}/tasks/${task._id}`, {
        text: newText.trim(),
        completed: false,
      });
      await fetchTasks();
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        confirmButtonText: 'OK',
      });
    }
  };

  const deleteTask = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This task will be deleted permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      await axios.delete(`${API_URL}/tasks/${id}`);
      fetchTasks();
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        confirmButtonText: 'OK',
      });
    }
  };

  const viewTask = (task) => {
    Swal.fire({
      title: 'Task Details',
      html: `
        <p><strong>Text:</strong> ${task.text}</p>
        <p><strong>Status:</strong> ${task.completed ? '✅ Completed' : '⏳ Pending'}</p>
      `,
      confirmButtonText: 'OK',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">TaskFlow Manager</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTask();
          }}
          className="flex mb-4"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a task"
            className="flex-grow px-4 py-2 border rounded-l-md outline-none"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md cursor-pointer"
          >
            Add
          </button>
        </form>

        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task._id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 p-4 rounded shadow space-y-2 sm:space-y-0">
              <div>
                <span
                  onClick={() => toggleComplete(task)}
                  className={`cursor-pointer ${task.completed ? 'line-through text-green-600' : 'text-gray-800'}`}
                >
                  {task.text}
                </span>
                <span className="ml-2 text-sm">
                  {task.completed ? 'Complete' : 'Pending'}
                </span>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => viewTask(task)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm">
                  View
                </button>
                <button onClick={() => editTask(task)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-sm">
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
