import { customerOrderModel } from "../../models/customer.order.model";

const PaypackJs = require("paypack-js").default;
const paypackClientId = process.env.CLIENT_ID || process.env.PAYPACK_CLIENT_ID;
const paypackClientSecret =
  process.env.CLIENT_SECRETE ||
  process.env.CLIENT_SECRET ||
  process.env.PAYPACK_CLIENT_SECRET;

const paypack =
  paypackClientId && paypackClientSecret
    ? PaypackJs.config({
        client_id: paypackClientId,
        client_secret: paypackClientSecret,
      })
    : null;

export const payment = async (req, res) => {
  if (!paypack) {
    return res.status(503).json({
      message:
        "Payment service is not configured. Set CLIENT_ID/CLIENT_SECRETE or PAYPACK_CLIENT_ID/PAYPACK_CLIENT_SECRET.",
    });
  }

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
  if (!paypack) {
    return res.status(503).json({
      message:
        "Payment service is not configured. Set CLIENT_ID/CLIENT_SECRETE or PAYPACK_CLIENT_ID/PAYPACK_CLIENT_SECRET.",
    });
  }

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
  if (!paypack) {
    return res.status(503).json({
      message:
        "Payment service is not configured. Set CLIENT_ID/CLIENT_SECRETE or PAYPACK_CLIENT_ID/PAYPACK_CLIENT_SECRET.",
    });
  }

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
