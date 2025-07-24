const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); // ✅ Added
const setupSocket = require('./socket');

const app = express();
const server = http.createServer(app);

// ✅ MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/your-db-name')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve static frontend files
app.use(express.static(path.join(__dirname, '..', 'client')));

// ✅ Serve PDF for book sync without forcing download
app.get('/pdf/:filename', (req, res) => {
  const filePath = path.join(__dirname, '..', 'client', 'pdf', req.params.filename);
  res.type('application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${req.params.filename}"`);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('❌ PDF send error:', err);
      res.status(404).send('PDF file not found');
    }
  });
});

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes); // ✅ New Route

// ✅ Frontend Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'admin-dashboard.html'));
});

// ✅ Setup Socket.IO
setupSocket(server);

// ✅ Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
