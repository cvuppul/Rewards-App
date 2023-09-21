import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Confetti from "react-confetti";

function ReceiptForm() {
  // State variables for UI and data management

  const [showConfetti, setShowConfetti] = useState(false);
  const [retailer, setRetailer] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [purchaseTime, setPurchaseTime] = useState("");
  const [total, setTotal] = useState("");
  const [items, setItems] = useState([{ shortDescription: "", price: "" }]);
  const [response, setResponse] = useState(null);
  const [showGif, setShowGif] = useState(false);
  const [points, setPoints] = useState(null);

  // Reset form fields to initial state
  const resetForm = () => {
    setRetailer("");
    setPurchaseDate("");
    setPurchaseTime("");
    setTotal("");
    setItems([{ shortDescription: "", price: "" }]);
    setResponse(null);
    setPoints(null);
  };

  // Add a new item to the items list
  const addNewItem = () => {
    setItems([...items, { shortDescription: "", price: "" }]);
  };

  // Remove an item from the items list
  const removeItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  // Fetch points for a given receipt ID
  const fetchPoints = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/receipts/${id}/points`
      );
      if (response.status === 200) {
        setPoints(response.data.points);
        console.log(response.data.points);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      } else {
        toast.error("Failed to fetch points.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("An error occurred while fetching the points:", error);
      toast.error("An error occurred while fetching the points.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        theme: "light",
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowGif(true);
    setTimeout(() => setShowGif(false), 2000);
    const data = {
      retailer,
      purchaseDate,
      purchaseTime,
      total: parseFloat(total),
      items: items.map((item) => ({
        shortDescription: item.shortDescription,
        price: parseFloat(item.price),
      })),
    };

    try {
      const response = await axios.post(
        "http://localhost:3001/api/receipts/process",
        data
      );

      if (response.status === 200) {
        setResponse(response.data);

        toast.success("Receipt submitted successfully!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          theme: "light",
        });
      } else {
        toast.error("Failed to submit receipt.", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("An error occurred while sending the form data:", error);
      toast.error("An error occurred while sending the form data.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        theme: "light",
      });
    }
  };

  // Render the form and response UI
  return (
    <div className="flex flex-col min-h-screen overflow-y-auto h-full pt-16">
      <div className="flex justify-center items-start h-full overflow-y-auto">
        <div className="w-5/12 max-w-md pl-4 pr-16 border-r-2">
          <img src="/f_logo.png" alt="Your Logo" className="mb-4 h-12" />
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="label-text">Retailer:</label>
              <input
                type="text"
                value={retailer}
                className="input input-bordered w-full"
                onChange={(e) => setRetailer(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="label-text">Purchase Date:</label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="label-text">Purchase Time:</label>
              <input
                type="time"
                value={purchaseTime}
                className="input input-bordered w-full"
                onChange={(e) => setPurchaseTime(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="label-text">Total:</label>
              <input
                type="text"
                value={total}
                className="input input-bordered w-full"
                onChange={(e) => setTotal(e.target.value)}
                required
              />
            </div>
            <div>
              <h3 className="text-lg mb-2">Items:</h3>
              {items.map((item, index) => (
                <div key={index} className="mb-4">
                  <div className="flex items-center mb-2">
                    <label className="label-text flex-grow">
                      Item {index + 1} - Description:
                    </label>
                    <button
                      className="btn btn-circle btn-sm ml-2"
                      type="button"
                      onClick={() => removeItem(index)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <textarea
                    type="text"
                    value={item.shortDescription}
                    className="textarea textarea-bordered w-full mb-2"
                    onChange={(e) => {
                      const updatedItems = [...items];
                      updatedItems[index].shortDescription = e.target.value;
                      setItems(updatedItems);
                    }}
                    required
                  />
                  <label className="label-text block mb-2">Item Price:</label>
                  <input
                    type="text"
                    value={item.price}
                    className="input input-bordered w-full"
                    onChange={(e) => {
                      const updatedItems = [...items];
                      updatedItems[index].price = e.target.value;
                      setItems(updatedItems);
                    }}
                    required
                  />
                </div>
              ))}
              <button
                className="btn btn-outline mt-2"
                type="button"
                onClick={addNewItem}
              >
                Add New Item
              </button>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <button className="btn btn-success mt-4 w-full" type="submit">
                  Submit
                </button>
              </div>
              <div className="w-full max-w-md ml-4">
                <button
                  className="btn btn-warning mt-4 w-full"
                  type="button"
                  onClick={() => fetchPoints(response.id)}
                >
                  Fetch Points
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="w-1/2 ml-8 flex flex-col items-center justify-center">
          {showConfetti && <Confetti />}
          {showGif ? (
            <iframe
              src="https://giphy.com/embed/mCRJDo24UvJMA"
              width="480"
              height="348"
              frameBorder="0"
              className="giphy-embed"
              allowFullScreen
            ></iframe>
          ) : points ? (
            <>
              <div className="mt-4 w-3/4 bg-gray-100 text-black p-6 rounded-lg ">
                <h3>Points:</h3>
                <p>{points}</p>
              </div>
              <button
                className="btn btn-outline mt-4"
                type="button"
                onClick={resetForm}
              >
                Reset Form
              </button>
            </>
          ) : response ? (
            <div className="mt-4 w-3/4 bg-gray-100 text-black p-6 rounded-lg">
              <h3>Response:</h3>
              <pre>{JSON.stringify(response, null, 2)}</pre>
            </div>
          ) : null}
        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        limit={1}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default ReceiptForm;
