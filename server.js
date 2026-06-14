const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'store.json');

app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

app.get('/api/data', (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return res.json(JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')));
    }
  } catch(e) {}
  res.json({});
});

app.post('/api/data', (req, res) => {
  const { password, data } = req.body;
  if (password !== 'kamba2025') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data), 'utf8');
  res.json({ success: true });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Kamba Store running on port ${PORT}`);
});
