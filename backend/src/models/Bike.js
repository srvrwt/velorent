const mongoose = require("mongoose");

const bikeSchema = new mongoose.Schema(
  {
    // ================================
    // OWNER
    // ================================

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


    // ================================
    // BIKE DETAILS
    // ================================

    bikeName: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    model: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },


    // ================================
    // BIKE IMAGES
    // ================================

    images: {
      front: {
        type: String,
        required: true,
      },

      back: {
        type: String,
        required: true,
      },

      left: {
        type: String,
        required: true,
      },

      right: {
        type: String,
        required: true,
      },
    },


    // ================================
    // REGISTRATION
    // ================================

    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },


    // ================================
    // ADDRESS
    // ================================

    address: {
      addressLine: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      district: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      pincode: {
        type: String,
        required: true,
        trim: true,
      },
    },


    // ================================
    // MOBILE
    // ================================

    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },


    // ================================
    // PRICING
    // ================================

    pricePerHour: {
      type: Number,
      required: true,
    },

    pricePerDay: {
      type: Number,
      required: true,
    },

    securityDeposit: {
      type: Number,
      default: 0,
    },


    // ================================
    // DOCUMENTS
    // ================================

    documents: {
      rc: {
        type: String,
        required: true,
      },

      idProof: {
        type: String,
        required: true,
      },
    },


    // ================================
    // STATUS
    // ================================

    status: {
      type: String,

      enum: [
        "pending",
        "approved",
        "rejected",
      ],

      default: "pending",
    },

    rejectionReason: {
      type: String,
      default: "",
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Bike", bikeSchema);