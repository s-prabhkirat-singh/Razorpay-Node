// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Razorpay = require('razorpay');
const Stripe = require('stripe');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const razorpay = new Razorpay({
  key_id: 'YOUR_RAZORPAY_KEY_ID',
  key_secret: 'YOUR_RAZORPAY_KEY_SECRET',
});

const stripe = Stripe('sk_test_51NjKHKSCz4789REwbBDLScTY48JTqobjlKUtqSdbt0J8m7FlidgtsCO3rlB3l40MI2ZPwzmVkNSUVDGvjJ3jclPS00ix6wbEDs');

// Create Order Endpoint
app.post('/createOrder', async (req, res) => {
  const options = {
    amount: req.body.amount, // Amount in paise
    currency: 'INR',
    receipt: 'receipt#1',
  };
  
  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body;
  
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd', // Specify the currency
      });
  
      res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

// Start the Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
