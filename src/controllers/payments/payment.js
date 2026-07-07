import { customerOrderModel } from "../../models/customer.order.model";

const PaypackJs = require("paypack-js").default;
const paypack = PaypackJs.config({
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRETE,
});

export const payment = async (req, res) => {
  let data = req.body;
  const order = await customerOrderModel.findById(data.orderId);
  if (!order) {
    return res.status(404).json({
      message: "Order not fund",
    });
  }
  await paypack
    .cashin({
      number: data.PhoneNumber,
      amount: order.TotalOrder,
      environment: "development",
    })
    .then(async (response) => {
      order.ref = response.data.ref;
      const reference = await order.save();
      if (!reference) {
        return res.status(401).json({
          message: "failed to add reference id",
        });
      }
      console.log("Response: ",response.data);
      res
        .status(201)
        .json({
          message: "Order initiated successfully. Please confirm the payment ",
          data: reference,
        });
    })
    .catch((err) => {
      console.log("errors", err);
      return res.status(500).json({ messages: err });
    });
};
export const cashout = (req, res) => {
  let datas = req.body;
  paypack
    .cashout({
      number: datas.PhoneNumber,
      amount: datas.amountmount,
      environment: "development",
    })
    .then((response) => {
      console.log(response.data);
      res.status(201).json({ data: response.data });
    })
    .catch((err) => {
      console.log("error", err);
      return res.status(500).json({ message: err });
    });
};
export const transaction = (req, res) => {
  paypack
    .transactions({ offset: 0, limit: 100 })
    .then((response) => {
      console.log(response.data);
      res.status(201).json({ data: response.data });
    })
    .catch((err) => {
      console.log("error", err);
      return res.status(500).json({ message: err });
    });
};
