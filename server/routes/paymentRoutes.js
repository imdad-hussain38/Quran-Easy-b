// server/routes/paymentRoutes.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const paymentFile = path.join(__dirname, '../data/payments.json');

// Helper to read existing payments
function readPayments() {
  if (!fs.existsSync(paymentFile)) return [];
  return JSON.parse(fs.readFileSync(paymentFile, 'utf-8'));
}

// Helper to save payment
function savePayment(payment) {
  const payments = readPayments();
  payments.push({ ...payment, date: new Date().toISOString() });
  fs.writeFileSync(paymentFile, JSON.stringify(payments, null, 2));
}

// Submit payment info
router.post('/submit', (req, res) => {
  const { payerName, transactionId, amount, course } = req.body;
  if (!payerName || !transactionId || !amount || !course) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  savePayment({ payerName, transactionId, amount, course });
  return res.json({ success: true, message: 'Payment received successfully.' });
});

module.exports = router;
