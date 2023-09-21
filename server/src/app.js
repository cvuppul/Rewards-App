const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Routes
const receiptRoutes = require("./routes/receiptRoutes");
app.use("/api/receipts", receiptRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
