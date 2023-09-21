const express = require("express");
const router = express.Router();
const receiptController = require("../controller/receiptController");

// Define API routes
router.post("/process", receiptController.submitReceipt);
router.get("/:id/points", receiptController.getPointsForReceipt);

module.exports = router;
