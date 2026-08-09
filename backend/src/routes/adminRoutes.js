const express = require("express");

const router = express.Router();

const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,

  adminAddBike,
  getAllBikes,
  approveBike,
  rejectBike,

} = require("../controllers/adminController");

const {
  protect,
  admin,
} = require("../middleware/authMiddleware");


// Get all users
router.get(
  "/users",
  protect,
  admin,
  getAllUsers
);


// Create new user
router.post(
  "/users",
  protect,
  admin,
  createUser
);


// Update user
router.put(
  "/users/:id",
  protect,
  admin,
  updateUser
);


// Delete user
router.delete(
  "/users/:id",
  protect,
  admin,
  deleteUser
);



// ADMIN BIKE ROUTES


// Admin add bike
router.post(
  "/bikes",
  protect,
  admin,
  adminAddBike
);


// Get all bikes
router.get(
  "/bikes",
  protect,
  admin,
  getAllBikes
);


// Approve bike
router.put(
  "/bikes/:id/approve",
  protect,
  admin,
  approveBike
);


// Reject bike
router.put(
  "/bikes/:id/reject",
  protect,
  admin,
  rejectBike
);

module.exports = router;