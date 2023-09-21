// Importing required modules
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

// Initializing receipts and pointsCache objects to store receipt data and calculated points
const receipts = {};
const pointsCache = {};

// Function to handle the submission of receipts
exports.submitReceipt = (req, res) => {
  try {
    const receipt = validateAndSanitizeReceipt(req.body);
    const id = uuidv4();
    const dataStr = JSON.stringify(receipt);
    const points = pointsCache[dataStr] || calculatePoints(receipt, dataStr);

    receipts[id] = { receipt, points };
    res.json({ id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Function to retrieve the points for a specific receipt
exports.getPointsForReceipt = (req, res) => {
  const id = req.params.id;
  const receiptData = receipts[id];

  if (receiptData) {
    res.json({ points: receiptData.points });
  } else {
    res.status(404).json({ error: "Receipt not found" });
  }
};

// Function to validate and sanitize the receipt data
function validateAndSanitizeReceipt(receipt) {
  const { retailer, purchaseDate, purchaseTime, items, total } = receipt;

  // Perform various validations on the receipt properties
  if (!retailer || typeof retailer !== "string")
    throw new Error("Invalid retailer");
  if (!purchaseDate || !moment(purchaseDate, "YYYY-MM-DD", true).isValid())
    throw new Error("Invalid purchase date format");
  if (!purchaseTime || !moment(purchaseTime, "HH:mm", true).isValid())
    throw new Error("Invalid purchase time format");
  if (
    !Array.isArray(items) ||
    items.some((item) => !item.shortDescription || isNaN(item.price))
  )
    throw new Error("Invalid items");
  if (isNaN(total)) throw new Error("Invalid total");

  return {
    retailer,
    purchaseDate,
    purchaseTime,
    items: items.map((item) => ({
      shortDescription: item.shortDescription,
      price: parseFloat(item.price),
    })),
    total: parseFloat(total),
  };
}

// Function to calculate points based on various rules
function calculatePoints(receipt, dataStr) {
  let points = 0;

  // Rule 1: Points for retailer name length
  if (receipt.retailer) {
    points += receipt.retailer.replace(/[^a-zA-Z0-9]/g, "").length;
  }

  // Rule 2 and Rule 3: Points for total being a whole number and multiple of 0.25
  if (receipt.total) {
    const totalFloat = parseFloat(receipt.total);
    points += totalFloat === Math.floor(totalFloat) ? 50 : 0;
    points += totalFloat % 0.25 === 0 ? 25 : 0;
  }

  // Rule 4 and Rule 5: Points for items and description length
  if (receipt.items && Array.isArray(receipt.items)) {
    points += Math.floor(receipt.items.length / 2) * 5; // 5 points for every two items

    receipt.items.forEach((item) => {
      const description = item.shortDescription || "";
      if (description.trim().length % 3 === 0 && item.price) {
        points += Math.ceil(item.price * 0.2);
      }
    });
  }

  // Rule 6: Points for purchase day being odd
  if (receipt.purchaseDate) {
    const day = parseInt(receipt.purchaseDate.split("-")[2], 10);
    points += day % 2 !== 0 ? 6 : 0;
  }

  // Rule 7: Points for purchase time between 14:00 and 15:59 inclusive
  if (receipt.purchaseTime) {
    const hour = parseInt(receipt.purchaseTime.split(":")[0], 10);
    points += hour >= 14 && hour < 16 ? 10 : 0;
  }

  // Cache the calculated points and return them
  pointsCache[dataStr] = points;
  return points;
}

// Exporting the functions for external use
exports.calculatePoints = calculatePoints;
exports.validateAndSanitizeReceipt = validateAndSanitizeReceipt;
