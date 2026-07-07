const PaypackJs = require("paypack-js").default;
require ('dotenv').config();
import { Order } from "../models/orderModel";

import { Payment } from "../models/paymentModel";

const paypack = PaypackJs.config({
  client_id: process.env.PAYPACK_CLIENT_ID,
  client_secret: process.env.PAYPACK_CLIENT_SECRET,
});


export const processCashIn = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId).populate('products.product');
   
    if (!order) {
      return res.status(404).json({ error: `Order with ID ${orderId} not found` });
    }

    const { number } = req.body;

    const totalOrderPrice = order.products.reduce((total, product) => {
      return total + product.product.price * product.count;
    }, 0);

    const paymentResponse = await paypack.cashin({
      number,
      amount: totalOrderPrice,
      environment: "development",
    });
  
   const paymentStatus = paymentResponse.success ? 'Completed' : 'Pending';
  
    const payment = await Payment.create({
      order: order._id,
      amount: totalOrderPrice,
      status: paymentStatus,
      eventRef: paymentResponse.ref,
    });

    await Order.findByIdAndUpdate(
      order._id,
       { payment: payment._id,
        eventRef: paymentResponse.ref,
       });

       if (callback) {
        callback(null, payment);
      } else {
        res.json({
          message: "Transaction created. Waiting for response...",
          payment,
        });
      }

  } catch (error) {
    console.error('Payment processing error:', error);
  
    if (callback) {
      callback(error, null);
    } else {
      res.status(500).json({ error: 'Payment processing error' });
    }
  }
};



const sendCallback = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Callback request failed');
    }

    return response; 
  } catch (error) {
    console.error('Callback request error:', error);
    throw error;
  }
};


export const callback = async (req, res) => {
  try {
    const { callbackUrl } = req.body;

    const payment = order.payment || {};

    try {
      const response = await sendCallback(callbackUrl, {
        success: true,
        payment,
      });

      if (!response.ok) {
        throw new Error('Callback request failed');
      }

      const responseObject = { message: "Transaction created. Waiting for response...", payment };
      return res.json(responseObject);

    } catch (error) {
      console.error('Callback request error:', error);
      if (callbackUrl) {
        try {
          await sendCallback(callbackUrl, { error: 'Payment processing error' });
        } catch (callbackError) {
          console.error('Callback request error:', callbackError);
          throw callbackError;
        }
      }
      throw new Error('Payment processing error');
    }
  } catch (error) {
    console.error('Internal server error:', error);
    if (res) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};








export const transactionsEvents = async (req, res) => {
  try {
    const response = await paypack.events({
      offset: 0,
      limit: 100
    });

    const eventData = response.data || [];

    for (let i = 0; i < eventData.length; i++) {
      const event = eventData[i];
      

      if (event && event.event_kind === "transaction:processed") {
        await processTransactionEvent(event);
      }
    }

    res.status(200).json({ data: eventData });
  } catch (err) {
    console.log(err);
    return res.status(500).json("internal server error");
  }
};



async function processTransactionEvent(event) {
  try {
    if (event.event_kind === "transaction:processed") {
      const transactionData = event.data;

      const order = await Order.findOne({ eventRef: transactionData.ref });

      if (order) {
        const newOrderStatus = transactionData.status === "successful" ? "Completed" : "Failed";
        console.log('Processing payment for order:', orderId);
        console.log('Current order status:', order.status);

        await Order.findByIdAndUpdate(order._id, { status: newOrderStatus });

        console.log('Updated order status:', newOrderStatus);

        for (const product of order.products) {
          const productToUpdate = await Product.findById(product.product._id);

          if (productToUpdate) {
            productToUpdate.stock_quantity -= product.count;
            await productToUpdate.save();
            console.log(`Stock quantity updated for product ${productToUpdate._id}.`);
          } else {
            console.error(`Product ${product.product._id} not found.`);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error processing transaction event:', error);
}
}
  


export const updatedOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    console.log('Processed order:', orderId);
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: `Order with ID ${orderId} not found` });
    }

    res.status(200).json({ updatedOrderStatus: order.status });
  } catch (error) {
    console.error('Error fetching updated order status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




//cashOut
export const cashOut = async (req, res) => {
    try {
      const order = await Order.findById(req.body.orderId); 
  
      const result = await paypack.cashout({
        number: req.body.number,
        amount: req.body.amount,
        environment: "production",
      });
  
      
      const payment = await Payment.create({
        order: order._id,
        amount: req.body.amount,
        status: "Completed",
      });
  
     
      await Order.findByIdAndUpdate(order._id, { payment: payment._id });
  
      res.status(200).json(result.data);
    } catch (error) {
      console.error(error);
      res.status(500).json("Internal Server Error");
    }
  };
  


  const getPaypackTransactions = async () => {
    try {
      const transactions = await paypack.transactions({ offset: 0, limit: 100 });
      console.log('Transactions:', transactions.data);
  
      return transactions.data;
    } catch (error) {
      console.error('Error retrieving transactions:', error);
      throw error;
    }
  };
//Transactions
export const transactions = async (req, res) => {
    try {
      const paypackTransactions = await getPaypackTransactions();
      
      const orders = await Order.find().populate('payment');
  
      const paymentData = orders.map(order => ({
        order: order._id,
        payment: order.payment,
      }));
  
      res.status(200).json({ data: paymentData,paypackTransactions });
    } catch (error) {
      console.error(error);
      res.status(500).json("Internal Server Error");
    }
  };
  


  




  export const getAllPayments = async (req, res) => {
    try {
      const allowedStatusValues = ['Completed', 'Pending', 'Failed']; 
      const paymentStatus = req.query.status || 'Completed';
       
      if (!allowedStatusValues.includes(paymentStatus)) {
        return res.status(400).json({ error: 'Invalid payment status' });
      }
      console.log(`Fetching payments with status: ${paymentStatus}`);
  
      const payments = await Payment.find({ status: paymentStatus });
  
      console.log(`Fetched payments with status: ${paymentStatus}`);
      
      res.status(200).json(payments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };



