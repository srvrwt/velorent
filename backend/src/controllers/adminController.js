const User = require("../models/User");
const Bike = require("../models/Bike");

// ==========================
// Get All Users
// ==========================
async function getAllUsers(req, res) {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}


// ==========================
// Create User
// ==========================
async function createUser(req, res) {
  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || "user",
    });

    // Remove password from response
    const userResponse = user.toObject();

    delete userResponse.password;

    res.status(201).json(userResponse);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}


// ==========================
// Update User
// ==========================
async function updateUser(req, res) {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      role,
    } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = name;
    user.email = email;
    user.role = role;

    await user.save();

    res.json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}


// ==========================
// Delete User
// ==========================
async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.json({
      message: "User deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

// =====================================================
// ADMIN: ADD BIKE
// =====================================================

const adminAddBike = async (
  req,
  res
) => {
  try {
    const {
      owner,
      bikeName,
      brand,
      model,
      category,
      description,
      images,
      registrationNumber,
      location,
      pricePerHour,
      pricePerDay,
      securityDeposit,
      status,
    } = req.body;

    if (
      !owner ||
      !bikeName ||
      !brand ||
      !model ||
      !category ||
      !description ||
      !registrationNumber ||
      !location ||
      pricePerHour === undefined ||
      pricePerDay === undefined
    ) {
      return res.status(400).json({
        message:
          "Please fill all required fields",
      });
    }

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

    const bike =
      await Bike.create({
        owner,

        addedBy:
          req.user._id,

        bikeName,
        brand,
        model,
        category,
        description,

        images: images || [],

        registrationNumber,

        location,

        pricePerHour,

        pricePerDay,

        securityDeposit:
          securityDeposit || 0,

        // Admin can approve directly
        status:
          status === "approved"
            ? "approved"
            : "pending",
      });

    res.status(201).json({
      message:
        "Bike added successfully",

      bike,
    });
  } catch (error) {
    console.error(
      "Admin Add Bike Error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to add bike",
    });
  }
};


// =====================================================
// ADMIN: GET ALL BIKES
// =====================================================

const getAllBikes = async (
  req,
  res
) => {
  try {
    const bikes =
      await Bike.find()
        .populate(
          "owner",
          "name email"
        )
        .populate(
          "addedBy",
          "name email role"
        )
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
      message:
        "Failed to fetch bikes",
    });
  }
};


// =====================================================
// ADMIN: APPROVE BIKE
// =====================================================

const approveBike = async (
  req,
  res
) => {
  try {
    const bike =
      await Bike.findById(
        req.params.id
      );

    if (!bike) {
      return res.status(404).json({
        message:
          "Bike not found",
      });
    }

    bike.status =
      "approved";

    bike.rejectionReason =
      "";

    await bike.save();

    res.status(200).json({
      message:
        "Bike approved successfully",

      bike,
    });
  } catch (error) {
    console.error(
      "Approve Bike Error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to approve bike",
    });
  }
};


// =====================================================
// ADMIN: REJECT BIKE
// =====================================================

const rejectBike = async (
  req,
  res
) => {
  try {
    const {
      rejectionReason,
    } = req.body;

    const bike =
      await Bike.findById(
        req.params.id
      );

    if (!bike) {
      return res.status(404).json({
        message:
          "Bike not found",
      });
    }

    bike.status =
      "rejected";

    bike.rejectionReason =
      rejectionReason || "";

    await bike.save();

    res.status(200).json({
      message:
        "Bike rejected successfully",

      bike,
    });
  } catch (error) {
    console.error(
      "Reject Bike Error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to reject bike",
    });
  }
};



module.exports = {
  // User
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,

  // Bikes
  adminAddBike,
  getAllBikes,
  approveBike,
  rejectBike,
};