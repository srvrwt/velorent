const express = require("express");

const router =
  express.Router();


const {
  addBike,
  getMyBikes,
  getApprovedBikes,
  getBikeById,
    getAllBikes,
      approveBike,
} = require(
  "../controllers/bikeController"
);


const {
  protect,
   admin,
} = require(
  "../middleware/authMiddleware"
);


const upload =
  require(
    "../middleware/uploadMiddleware"
  );


// ==========================================
// ADD BIKE
// ==========================================

router.post(
  "/",
  protect,

  upload.fields([

    {
      name: "frontImage",
      maxCount: 1,
    },

    {
      name: "backImage",
      maxCount: 1,
    },

    {
      name: "leftImage",
      maxCount: 1,
    },

    {
      name: "rightImage",
      maxCount: 1,
    },

    {
      name: "rcDocument",
      maxCount: 1,
    },

    {
      name: "idProof",
      maxCount: 1,
    },

  ]),

  addBike
);


// ==========================================
// MY BIKES
// ==========================================

router.get(
  "/my-bikes",
  protect,
  getMyBikes
);


// ==========================================
// PUBLIC BIKES
// ==========================================

router.get(
  "/approved",
  getApprovedBikes
);


// ==========================================
// SINGLE BIKE
// ==========================================

router.get(
  "/:id",
  getBikeById
);


module.exports = router;