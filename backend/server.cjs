const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Configure CORS to allow requests from http://localhost:5173
app.use(cors({
  origin: 'http://localhost:5173', // Match your frontend's origin
  methods: ['GET', 'POST'],        // Specify allowed methods
  allowedHeaders: ['Content-Type'], // Specify allowed headers
}));

app.use(express.json());

app.post('/analyze-resume', upload.single('resume'), (req, res) => {
  const resumePath = req.file.path;
  const jobDesc = req.body.jobDesc;

  const pythonProcess = spawn(path.join(__dirname, 'venv/bin/python3'), [
    path.join(__dirname, 'resume_analyzer.py'),
    resumePath,
    jobDesc,
  ]);

  let output = '';
  let errorOutput = '';

  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      try {
        const result = JSON.parse(output);
        res.json(result);
      } catch (e) {
        res.status(500).json({ error: 'Failed to parse AI response' });
      }
    } else {
      res.status(500).json({ error: errorOutput || 'Python script failed' });
    }
  });
});

const PORT = 5000;
app.get('/hello', (req, res) => res.send('Hi from the backend!'));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));