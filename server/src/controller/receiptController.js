const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

// In-memory storage for receipts
const receipts = {};

exports.submitReceipt = (req, res) => {
  console.log("reached server");

  const receipt = req.body;
  const id = uuidv4();
  const points = calculatePoints(receipt);

  // Store the receipt and its points in memory
  receipts[id] = {
    receipt,
    points,
  };

  res.json({ id });
};

exports.getPointsForReceipt = (req, res) => {
  const id = req.params.id;
  // Check if the receipt exists in memory
  if (receipts[id]) {
    res.json({ points: receipts[id].points });
  } else {
    res.status(404).json({ error: "Receipt not found" });
  }
};

function calculatePoints(data) {
  let points = 0;

  /* ------------------------------- Request Validation ------------------------------- */

  // I have written request validation for just date and time, but we can easily write validations for the rest if needed.

  // 1. Using RegEx
  if (data.purchaseDate && !/^\d{4}-\d{2}-\d{2}$/.test(data.purchaseDate)) {
    throw new Error("Invalid purchase date format.");
  }

  if (data.purchaseTime && !/^\d{2}:\d{2}$/.test(data.purchaseTime)) {
    throw new Error("Invalid purchase time format.");
  }

  // 2. Using Moment.js
  if (
    data.purchaseDate &&
    !moment(data.purchaseDate, "YYYY-MM-DD", true).isValid()
  ) {
    throw new Error("Invalid purchase date format.");
  }

  if (
    data.purchaseTime &&
    !moment(data.purchaseTime, "HH:mm", true).isValid()
  ) {
    throw new Error("Invalid purchase time format.");
  }
  /* ------------------ 7 Rule checks to calculate Points ------------------ */

  const cache = {};
  const dataStr = JSON.stringify(data);
  if (cache[dataStr]) {
    return cache[dataStr];
  }

  // Rule 1
  if (data.retailer) {
    points += data.retailer.replace(/[^a-zA-Z0-9]/g, "").length;
  }

  // Rule 2 and Rule 3
  if (data.total) {
    const totalFloat = parseFloat(data.total);
    if (totalFloat === Math.floor(totalFloat)) {
      points += 50;
    }
    if (totalFloat % 0.25 === 0) {
      points += 25;
    }
  }

  // Rule 4 and Rule 5
  if (data.items && Array.isArray(data.items)) {
    points += Math.floor(data.items.length / 2) * 5;

    data.items.forEach((item) => {
      const description = item.shortDescription || "";
      if (description.trim().length % 3 === 0 && item.price) {
        points += Math.ceil(item.price * 0.2);
      }
    });
  }

  // Rule 6
  if (data.purchaseDate) {
    const day = parseInt(data.purchaseDate.split("-")[2], 10);
    if (day % 2 !== 0) {
      points += 6;
    }
  }

  // Rule 7
  if (data.purchaseTime) {
    const time = data.purchaseTime.split(":").map(Number);
    if (time[0] >= 14 && time[0] < 16) {
      points += 10;
    }
  }

  // Store result in cache
  cache[dataStr] = points;

  return points;
}

exports.calculatePoints = calculatePoints;
