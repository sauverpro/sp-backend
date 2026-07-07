import { customerOrderModel, paymentModel } from "../../models";

export const callback = async (req, res) => {
  try {
    console.log("callback data", req.body);
    const savePayment = await paymentModel.create(req.body.data);
    if (!savePayment) {
      return res.status(404).json({
        message: "Failed to save Payment ",
      });
    }
    console.log("=====payment status: ", savePayment, "=======");
    if (savePayment.status === "successful") {
      const order = await customerOrderModel.findOne({ ref: savePayment.ref });
      if (!order) {
        return res.status(404).json({
          message: "Payment reference does not found",
        });
      }
      order.status = "Processing";
      order.isPaid = true;
      const saveOrder = await order.save();
      if (!saveOrder) {
        return res.status(401).json({
          message: "failed to update order",
        });
      }
      console.log("Payment received Successfully");
      return res
        .status(201)
        .json({ message: "Payment received Successfully", data: saveOrder });
    }
    console.log("Payment failed please try again later");
    return res.status(200).json({
      message: "Payment failed please try again later",
    });
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({
      message: "Internal sever error",
      error: error.message,
    });
  }
};
