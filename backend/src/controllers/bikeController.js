const Bike = require("../models/Bike");


// ==========================================
// USER: ADD BIKE
// ==========================================

const addBike = async (
  req,
  res
) => {

  try {

    const {

      bikeName,
      brand,
      model,
      category,
      description,

      registrationNumber,

      addressLine,
      city,
      district,
      state,
      pincode,

      mobileNumber,

      pricePerHour,
      pricePerDay,
      securityDeposit,

    } = req.body;


    // ==========================================
    // CHECK FILES
    // ==========================================

    if (
      !req.files?.frontImage ||
      !req.files?.backImage ||
      !req.files?.leftImage ||
      !req.files?.rightImage
    ) {

      return res.status(400).json({

        message:
          "All 4 bike images are required",

      });

    }


    if (
      !req.files?.rcDocument ||
      !req.files?.idProof
    ) {

      return res.status(400).json({

        message:
          "RC and ID proof are required",

      });

    }


    // ==========================================
    // CHECK REQUIRED FIELDS
    // ==========================================

    if (
      !bikeName ||
      !brand ||
      !model ||
      !category ||
      !description ||
      !registrationNumber ||
      !addressLine ||
      !city ||
      !district ||
      !state ||
      !pincode ||
      !mobileNumber
    ) {

      return res.status(400).json({

        message:
          "Please fill all required fields",

      });

    }


    // ==========================================
    // CHECK REGISTRATION
    // ==========================================

    const existingBike =
      await Bike.findOne({

        registrationNumber:
          registrationNumber.toUpperCase(),

      });


    if (existingBike) {

      return res.status(400).json({

        message:
          "A bike with this registration number already exists",

      });

    }


    // ==========================================
    // FILE URLS
    // ==========================================

    const frontImage =
      `/uploads/bikes/${req.files.frontImage[0].filename}`;

    const backImage =
      `/uploads/bikes/${req.files.backImage[0].filename}`;

    const leftImage =
      `/uploads/bikes/${req.files.leftImage[0].filename}`;

    const rightImage =
      `/uploads/bikes/${req.files.rightImage[0].filename}`;


    const rcDocument =
      `/uploads/documents/${req.files.rcDocument[0].filename}`;

    const idProof =
      `/uploads/documents/${req.files.idProof[0].filename}`;


    // ==========================================
    // CREATE BIKE
    // ==========================================

    const bike =
      await Bike.create({

        owner:
          req.user._id,

        addedBy:
          req.user._id,


        bikeName,

        brand,

        model,

        category,

        description,


        images: {

          front:
            frontImage,

          back:
            backImage,

          left:
            leftImage,

          right:
            rightImage,

        },


        registrationNumber,


        address: {

          addressLine,

          city,

          district,

          state,

          pincode,

        },


        mobileNumber,


        pricePerHour,

        pricePerDay,

        securityDeposit:
          securityDeposit || 0,


        documents: {

          rc:
            rcDocument,

          idProof:
            idProof,

        },


        status:
          "pending",

      });


    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(201).json({

      message:
        "Bike submitted successfully for admin approval",

      bike,

    });


  } catch (error) {

    console.error(
      "Add Bike Error:",
      error
    );


    res.status(500).json({

      message:
        "Failed to add bike",

    });

  }

};


// ==========================================
// USER: MY BIKES
// ==========================================

const getMyBikes = async (
  req,
  res
) => {

  try {

    const bikes =
      await Bike.find({

        owner:
          req.user._id,

      }).sort({

        createdAt:
          -1,

      });


    res.status(200).json(
      bikes
    );


  } catch (error) {

    console.error(
      "Get My Bikes Error:",
      error
    );


    res.status(500).json({

      message:
        "Failed to fetch your bikes",

    });

  }

};

// =====================================================
// ADMIN: GET ALL BIKES
// =====================================================

const getAllBikes = async (req, res) => {
  try {
    const bikes = await Bike.find()
      .populate("owner", "name email")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(bikes);

  } catch (error) {
    console.error(
      "Get All Bikes Error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch bikes",
    });
  }
};


// ==========================================
// PUBLIC: APPROVED BIKES
// ==========================================

const getApprovedBikes = async (
  req,
  res
) => {

  try {

    const bikes =
      await Bike.find({

        status:
          "approved",

      })
      .populate(
        "owner",
        "name"
      )
      .sort({

        createdAt:
          -1,

      });


    res.status(200).json(
      bikes
    );


  } catch (error) {

    console.error(
      "Get Approved Bikes Error:",
      error
    );


    res.status(500).json({

      message:
        "Failed to fetch bikes",

    });

  }

};


// ==========================================
// PUBLIC: SINGLE BIKE
// ==========================================

const getBikeById = async (
  req,
  res
) => {

  try {

    const bike =
      await Bike.findById(
        req.params.id
      )
      .populate(
        "owner",
        "name email"
      );


    if (!bike) {

      return res.status(404).json({

        message:
          "Bike not found",

      });

    }


    if (
      bike.status !==
      "approved"
    ) {

      return res.status(404).json({

        message:
          "Bike is not available",

      });

    }


    res.status(200).json(
      bike
    );


  } catch (error) {

    console.error(
      "Get Bike Error:",
      error
    );


    res.status(500).json({

      message:
        "Failed to fetch bike",

    });

  }

};

// =====================================================
// ADMIN: APPROVE BIKE
// =====================================================

const approveBike = async (req, res) => {
  try {
    const bike = await Bike.findById(
      req.params.id
    );

    if (!bike) {
      return res.status(404).json({
        message: "Bike not found",
      });
    }

    // Approve bike
    bike.status = "approved";

    // Save admin who approved the bike
    bike.approvedBy = req.user._id;

    bike.approvedAt = new Date();

    await bike.save();

    res.status(200).json({
      message: "Bike approved successfully",
      bike,
    });

  } catch (error) {
    console.error(
      "Approve Bike Error:",
      error
    );

    res.status(500).json({
      message: "Failed to approve bike",
    });
  }
};

// =====================================================
// ADMIN: REJECT BIKE
// =====================================================

const rejectBike = async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    const bike = await Bike.findById(
      req.params.id
    );

    if (!bike) {
      return res.status(404).json({
        message: "Bike not found",
      });
    }

    // Update bike status
    bike.status = "rejected";

    // Save rejection reason
    bike.rejectionReason =
      rejectionReason || "Bike rejected by admin";

    // Save admin who rejected the bike
    bike.rejectedBy = req.user._id;

    bike.rejectedAt = new Date();

    await bike.save();

    res.status(200).json({
      message: "Bike rejected successfully",
      bike,
    });

  } catch (error) {
    console.error(
      "Reject Bike Error:",
      error
    );

    res.status(500).json({
      message: "Failed to reject bike",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {

  // User

  addBike,
  getMyBikes,
  getApprovedBikes,
  getBikeById,
  getAllBikes,
  getAllBikes,
  approveBike,
  rejectBike,

};