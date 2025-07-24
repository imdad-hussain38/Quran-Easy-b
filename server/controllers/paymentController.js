const submitPayment = async (req, res) => {
  const { payerName, transactionId, amount, course } = req.body;

  if (!payerName || !transactionId || !amount || !course) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  console.log('💰 Payment Info:', { payerName, transactionId, amount, course });

  return res.status(200).json({ message: 'Payment info received successfully.' });
};

module.exports = { submitPayment };
