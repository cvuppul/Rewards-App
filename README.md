# Fetch Rewards Application 🛍️

## Overview 📘

Fetch Rewards Point Calculator is a dynamic application designed to reward users with points by processing their shopping receipts. Users can effortlessly earn points by uploading a snapshot of their receipt, allowing the app to extract essential details such as retailer name, date and time of purchase, item descriptions, and prices. The accumulated points can be redeemed for various rewards, enhancing the overall shopping experience.

## Tech Stack 🛠️

- **Frontend**: React, Daisy UI
- **Styling**: Tailwind.css
- **Backend**: Node and Express
- **Unit Testing**: Jest

## Deployment 🌐

The application is deployed on Netlify for the frontend and Render for the backend, ensuring a seamless and robust user experience.

🔗 Live Site URL: https://650c6e2a40025650922aa37b--bucolic-nougat-302e68.netlify.app

## Application Demo 🪄

![Application Demo](fetch.gif)

## Project Structure 📂

```perl
fetch-rewards/
│
├── node_modules/
├── public/                  # Static contents like logos
│
├── server/                  # Backend server code
│   ├── node_modules/
│   ├── src/
│   │   ├── controller/     # Methods to process data
│   │   ├── routes/         # API endpoints
│   │   └── app.js          # Main server file
│   ├── tests/              # Unit tests for backend code
│   ├── package.json
│   └── package-lock.json
│
├── src/                     # Frontend code
│   ├── pages/
│   │   └── receipt-form/   # UI for entering receipt details
│   ├── app.css
│   ├── app.jsx
│   ├── index.css
│   └── main.jsx            # Renders the receipt form
│
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
├── webpack.config.js
├── README.md               # Updated README with front-end and backend documentation
└── tailwindconfig.js

```

## Code Optimization and Efficiency 🚀

1. Caching Mechanism: The application employs a caching mechanism using the pointsCache object to store the results of previously calculated points. This ensures that if the same data is processed multiple times, the result is retrieved from the cache without recalculating, optimizing the performance especially for repeated data.

2. In-Memory Storage: The application uses the receipts object as an in-memory storage for quick retrieval of receipt data. This is efficient for small datasets but might need reconsideration for scalability with larger datasets, where a database or persistent storage solution would be more appropriate.

3. Data Validation and Sanitization: The application meticulously validates and sanitizes receipt data before processing, ensuring data integrity and reducing the risk of errors during point calculations.

## Validation Logic 🛡️

1. Comprehensive Date and Time Validation: The application exclusively uses Moment.js for validating the format of purchase date and time, ensuring valid and logical date/time values. This provides a more comprehensive and reliable validation compared to regular expressions.

2. Data Type and Structure Validation: The application validates the data type and structure of each property of the receipt, including retailer, items, and total. Any discrepancies in the expected data type or structure result in an error, maintaining the robustness of the application.

3. Item Validation: Each item in the receipt is validated for the presence of a description and a valid price, ensuring the integrity of the items data.

## Application Flow 🌊

![Application Flow Diagram](map.png)

- **Frontend**:
  - The main entry point is `main.jsx` which renders the `ReceiptForm` component.
  - Users can input receipt details in the `ReceiptForm` component.
  - On form submission, the data is sent to the server for processing.
  - Users can also fetch points associated with the receipt.
- **Backend** 🖥️
  - `Main Server File`: The core server file is app.js, responsible for initializing the Express server and defining routes.
  - `Route Definition`: The route /api/receipts is pivotal and is managed within receiptRoutes.js. It acts as a conduit to various functionalities within the application.
  - `Route Handlers`: Within receiptRoutes.js, two principal routes are discerned:
    - `/process`: This route is implicit and is managed by the submitReceipt method in receiptController.js. It oversees the submission of receipts, performing validations, and calculations before storing the receipt data.
    - `:id/points`: This route is managed by the getPointsForReceipt method in receiptController.js. It is dedicated to fetching points associated with a specific receipt ID, returning an error if the receipt is not found.
  - `Data Validation and Sanitization`: The validateAndSanitizeReceipt function is invoked to ensure the integrity of the receipt data, performing rigorous checks and sanitizations on each property of the receipt.
  - `Points Calculation`: The calculatePoints function is employed to compute points based on various rules and conditions, and the results are cached to optimize subsequent requests with identical data.

## Utility Functions

- `resetForm`: Resets all form fields to their initial state.
- `addNewItem`: Adds a new item to the receipt.
- `removeItem`: Removes an item from the receipt based on its index.
- `fetchPoints`: Fetches points for a given receipt ID from the server.
- `handleSubmit`: Handles the form submission, sends data to the server, and provides visual feedback.

## Component States

- `showConfetti`: Controls the display of the confetti animation.
- `retailer`, `purchaseDate`, `purchaseTime`, `total`: Form fields for receipt details.
- `items`: An array of items purchased.
- `response`: Stores the server's response after submitting the receipt.
- `showGif`: Controls the display of a GIF.
- `points`: Stores the points fetched from the server.

## Visual Feedback 🌟

1. Interactive Notifications: Utilizes React `Toastify` to display immediate and interactive toast notifications on form submission and points fetching, keeping users informed and engaged.
2. Celebratory Animations: Employs React `Confetti` for celebratory animations upon successful actions, adding a delightful touch to user interactions.
3. Informative GIFs: Incorporates informative `GIFs` during actions like form submission, providing visual cues and making the interface lively and dynamic.

## Test Cases 🧪

I have designed a set of unit tests to ensure the robustness and accuracy of the point calculation system. Here's a brief summary of the test cases:

1. Validates point calculation for a receipt from "M&M Corner Market".
2. Validates point calculation for a receipt from "Target".
3. Checks point addition based on the alphanumeric characters in the retailer's name.
4. Ensures 50 points are added if the total amount is a whole number.
5. Confirms 25 points are added if the total amount is divisible by 0.25.
6. Validates point addition based on the number of items in the receipt.
7. Checks point calculation based on item description length and its price.
8. Adds 6 points if the purchase date falls on an odd day.
9. Grants 10 points for purchases made between 2:00 pm and 4:00 pm.
10. Handles receipts with missing properties without errors.

These tests help in maintaining the integrity of the application and ensuring a consistent user experience.

![Test Cases Proof](tc.png)

## Running the Service Locally 🚀

Follow these steps to set up and run the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) installed (version 18.15.0 recommended)

### Step 1: Clone or Download the Repository

You can either clone the repository using Git or download the project folder directly from [here](https://github.com/kishore09/fetchrewards).

#### Clone the Repository (via Git):

```bash
git clone https://github.com/kishore09/fetchrewards.git
```

### Step 2: Install Dependencies

Install Frontend Dependencies (in the root directory):

```bash
cd fetchrewards
npm install
```

Install Backend Dependencies (inside the 'server' directory):

```bash
cd server
npm install
```

### Step 3: Run the Application

Start the Frontend (in the root directory):

```bash
npm run dev
```

This will start the frontend React application.

Start the Backend (inside the 'server/src' directory):

```bash
cd src
node app.js
```

This will start the Node.js backend server.

The application should now be up and running locally. 🎊

## Running Tests

To run tests for the server, navigate to the 'server' directory and execute the following command:

```bash
cd server
npm test
```

## Conclusion 🌟

My Fetch Rewards application is designed to be user-friendly and efficient. With a combination of unit tests and a UI, users can easily test and experience the functionality. The added animations and feedback mechanisms ensure a delightful user experience. I hope you find this documentation helpful!

## Kudos and Acknowledgements 🌟

This project was a solo endeavor, and a big shout-out goes to... 🥁🥁🥁

- **Netlify**, for hosting the frontend with grace and speed! 🚀
- **Render**, for being the reliable backbone, hosting the backend! 💪
- **Node and Express**, for making the server-side a breeze! 🌬️
- **React**, for the seamless UI magic! ✨
- **Daisy UI and Tailwind.css**, for the styling extravaganza! 🎨
- **Jest**, for keeping the code in check! ✔️

And let’s not forget, a whimsical nod to **Coffee** ☕ and **Late Nights** 🌙, for being the constant companions in this coding journey!

---

Made with ❤️ and a dash of humor by [Kishore](https://github.com/kishore09)
