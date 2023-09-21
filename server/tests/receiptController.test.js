const {
  calculatePoints,
  validateAndSanitizeReceipt,
} = require("../src/controller/receiptController");

describe("calculatePoints", () => {
  // Test for Receipt 1
  it("should calculate points correctly for M&M Corner Market", () => {
    const testData1 = {
      retailer: "M&M Corner Market",
      purchaseDate: "2022-03-20",
      purchaseTime: "14:33",
      items: [
        { shortDescription: "Gatorade", price: "2.25" },
        { shortDescription: "Gatorade", price: "2.25" },
        { shortDescription: "Gatorade", price: "2.25" },
        { shortDescription: "Gatorade", price: "2.25" },
      ],
      total: 9.0,
    };

    const result1 = calculatePoints(testData1);
    expect(result1).toBe(109);
  });

  // Test for Receipt 2
  it("should calculate points correctly for Target", () => {
    const testData2 = {
      retailer: "Target",
      purchaseDate: "2022-01-01",
      purchaseTime: "13:01",
      items: [
        {
          shortDescription: "Mountain Dew 12PK",
          price: "6.49",
        },
        {
          shortDescription: "Emils Cheese Pizza",
          price: "12.25",
        },
        {
          shortDescription: "Knorr Creamy Chicken",
          price: "1.26",
        },
        {
          shortDescription: "Doritos Nacho Cheese",
          price: "3.35",
        },
        {
          shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ",
          price: "12.00",
        },
      ],
      total: "35.35",
    };

    const result2 = calculatePoints(testData2);
    expect(result2).toBe(28);
  });

  // Test for Rule 1
  it("Test for Rule 1: should calculate points based on the retailer's alphanumeric characters", () => {
    const testData = {
      retailer: "M&M",
    };

    const result = calculatePoints(testData);
    expect(result).toBe(2); // 2 alphanumeric characters
  });

  // Test for Rule 2
  it("Test for Rule 2: should add 50 points if total is a whole number", () => {
    const testData = {
      total: "103.00",
    };

    const result = calculatePoints(testData);
    expect(result).toBe(75); // 50 points for Rule 2 + 25 points for Rule 3
  });

  // Test for Rule 3
  it("Test for Rule 3: should add 25 points if total is divisible by 0.25", () => {
    const testData = {
      total: "2.25",
    };

    const result = calculatePoints(testData);
    expect(result).toBe(25);
  });

  // Test for Rule 4
  it("Test for Rule 4: should add points based on the number of items", () => {
    const testData = {
      items: ["item1", "item2", "item3", "item4"],
    };

    const result = calculatePoints(testData);
    expect(result).toBe(10); // 5 points for every 2 items
  });

  // Test for Rule 5
  it("Test for Rule 5: should add points based on item description and price", () => {
    const testData = {
      items: [
        { shortDescription: "descdesc", price: "5" }, // 8 characters in description
      ],
    };

    const result = calculatePoints(testData);
    expect(result).toBe(0); // Description length is not divisible by 3, so no points added
  });

  // Test for Rule 6
  it("Test for Rule 6: should add 6 points if purchase date is an odd day", () => {
    const testData = {
      purchaseDate: "2022-03-21", // 21 is odd
    };

    const result = calculatePoints(testData);
    expect(result).toBe(6);
  });

  // Test for Rule 7
  it("Test for Rule 7: should add 10 points if purchase time is between 14 and 16", () => {
    const testData = {
      purchaseTime: "14:30",
    };

    const result = calculatePoints(testData);
    expect(result).toBe(10);
  });

  // Edge case: should handle missing properties gracefully
  it("Edge case: should handle missing properties gracefully", () => {
    const testData = {};

    const result = calculatePoints(testData);
    expect(result).toBe(0);
  });

  // Test Case for invalid date and time formats
  // Test Case for invalid date and time formats
  it("should throw an error for invalid date and time formats", () => {
    const testDataInvalidDate = {
      retailer: "Valid Retailer",
      purchaseDate: "2022/03/21", // Invalid date format
      purchaseTime: "14:30",
      items: [{ shortDescription: "Valid Item", price: "1.00" }],
      total: "1.00",
    };

    const testDataInvalidTime = {
      retailer: "Valid Retailer",
      purchaseDate: "2022-03-21",
      purchaseTime: "14-30", // Invalid time format
      items: [{ shortDescription: "Valid Item", price: "1.00" }],
      total: "1.00",
    };

    // Expect validateAndSanitizeReceipt to throw an error for invalid date format
    expect(() => {
      validateAndSanitizeReceipt(testDataInvalidDate);
    }).toThrow(new Error("Invalid purchase date format"));

    // Expect validateAndSanitizeReceipt to throw an error for invalid time format
    expect(() => {
      validateAndSanitizeReceipt(testDataInvalidTime);
    }).toThrow(new Error("Invalid purchase time format"));
  });
});
