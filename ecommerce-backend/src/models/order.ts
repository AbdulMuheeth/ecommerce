import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      pinCode: {
        type: Number,
        min: 100000,
        max: 900000,
        required: true,
      },
    },


    user: {
      type: String, // id of user (customID so string)
      ref: "User", // reference to which collection
      required: true,
    },


    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingCharges: {
      type: Number,
      required: true,
      default:0
    },
    discount: {
      type: Number,
      required: true,
      default:0
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["processing", "shipped", "delivered"],
      default: "processing",
    },

    
    orderItems: [
      {
        name: String,
        photo: String,
        price: Number,
        quantity: Number,
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", schema);
