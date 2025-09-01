const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const Task = require('./models/Task');

// Routes
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const newTask = new Task({ text: req.body.text });
  const savedTask = await newTask.save();
  res.json(savedTask);
});

app.delete('/tasks/:id', async (req, res) => {
  const deletedTask = await Task.findByIdAndDelete(req.params.id);
  res.json(deletedTask);
});


app.put('/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          text: req.body.text,
          completed: req.body.completed,
          createdAt: req.body.createdAt,
        },
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    res.json(updatedTask);
  } catch (err) {
    console.error('PUT error:', err);
    res.status(500).json({ error: 'Failed to update task.' });
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
