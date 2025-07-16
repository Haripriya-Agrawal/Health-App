import React, { useState } from "react";
import Navbar from "../components/Navbar";

const MealPlanner: React.FC = () => {
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [itemData, setItemData] = useState({
    name: "",
    category: "",
    qty: "",
    unit: "g",
  });

  const categories = ["Fresh Produce", "Dairy", "Grains & Pulses", "Drinks & Snacks", "Misc"];

  const groceries = [
    "Broccoli", "Cauliflower", "Bhindi", "Bread", "Milk", "Paneer", "Potato", "Chana",
    "Mustard Oil", "Kidney Beans", "Tomato", "Spinach", "Carrot", "Masoor Dal", "Almond", "Walnut",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setItemData({ ...itemData, [name]: value });
  };

  const handleAddItem = () => {
    console.log("Item Added:", itemData);
    setShowAddItemModal(false);
    setItemData({ name: "", category: "", qty: "", unit: "g" });
  };

  return (
    <div className="min-h-screen bg-lightblue p-4">
      <Navbar />
      <h1 className="text-center text-3xl font-bold text-white mb-6">Meal Planner</h1>

      <div className="flex flex-wrap gap-6 justify-center">
        {/* Meal Planner Section */}
        <div className="bg-pink-50 p-4 rounded-3xl shadow-md border-2 border-blue-400 w-[700px]">
          {/* Breakfast */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Breakfast</h2>
            <div className="flex flex-col gap-2">
              <button className="bg-gradient-to-r from-orange-400 to-orange-300 text-white px-4 py-2 rounded-full shadow">
                Generate meals based on available groceries
              </button>
              <button className="bg-gradient-to-r from-orange-400 to-orange-300 text-white px-4 py-2 rounded-full shadow">
                Manually enter meal
              </button>
            </div>
          </div>

          {/* Lunch */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Lunch</h2>
            <div className="flex gap-6">
              <div className="bg-blue-200 p-3 rounded-lg text-sm w-1/2">
                <p>2 Ragi Dosas With Sambar & Chutney</p>
                <p>Veggie Bowl</p>
                <p>Papad , Roasted</p>
              </div>
              <div className="bg-blue-200 p-3 rounded-lg text-sm w-1/2">
                <p>Calories : 500 kcal</p>
                <p>Carbs : 120g</p>
                <p>Protein : 18g</p>
                <p>Fibre : 12g</p>
              </div>
            </div>
          </div>

          {/* Snacks */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Snacks</h2>
            <div className="bg-blue-300 p-8 rounded-lg mb-2 text-white font-semibold text-center">Enter Meal</div>
            <button className="bg-gradient-to-r from-orange-400 to-orange-300 text-white px-4 py-2 rounded-full shadow">
              Calculate Macros
            </button>
          </div>

          {/* Dinner */}
          <div>
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Dinner</h2>
            <div className="flex gap-6">
              <div className="bg-blue-200 p-3 rounded-lg text-sm w-1/2">
                <p>2 Ragi Dosas With Sambar & Chutney</p>
                <p>Veggie Bowl</p>
                <p>Papad , Roasted</p>
              </div>
              <div className="bg-blue-200 p-3 rounded-lg text-sm w-1/2">
                <p>Calories : 500 kcal</p>
                <p>Carbs : 120g</p>
                <p>Protein : 18g</p>
                <p>Fibre : 12g</p>
              </div>
            </div>
          </div>
        </div>

        {/* Groceries Section */}
        <div className="bg-pink-50 p-4 rounded-3xl shadow-md w-[300px]">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">Groceries</h2>

          <div className="relative flex justify-center gap-2 mb-4">
            <div className="relative">
              <button
                className="bg-gradient-to-r from-orange-400 to-orange-300 text-white px-3 py-1 rounded-full text-sm"
                onClick={() => setShowAddItemModal((prev) => !prev)}
              >
                Add Items
              </button>

              {showAddItemModal && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white border rounded-xl p-4 shadow-xl w-64 z-50">
                  <h3 className="text-sm font-bold text-blue-700 mb-2 text-center">Add Grocery Item</h3>
                  <input
                    type="text"
                    name="name"
                    placeholder="Item Name"
                    value={itemData.name}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm mb-2"
                  />
                  <select
                    name="category"
                    value={itemData.category}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1 text-sm mb-2"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="number"
                      name="qty"
                      placeholder="Qty"
                      value={itemData.qty}
                      onChange={handleChange}
                      className="w-1/2 border rounded px-2 py-1 text-sm"
                    />
                    <select
                      name="unit"
                      value={itemData.unit}
                      onChange={handleChange}
                      className="w-1/2 border rounded px-2 py-1 text-sm"
                    >
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="ml">ml</option>
                      <option value="l">l</option>
                      <option value="pcs">pcs</option>
                    </select>
                  </div>
                  <div className="flex justify-between text-sm">
                    <button
                      onClick={() => setShowAddItemModal(false)}
                      className="text-red-500 px-2 py-1"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddItem}
                      className="bg-gradient-to-r from-orange-400 to-orange-300 text-white px-3 py-1 rounded-full"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button className="bg-gradient-to-r from-orange-400 to-orange-300 text-white px-3 py-1 rounded-full text-sm">
              To buy
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-4 text-sm">
            {categories.map((cat) => (
              <button key={cat} className="bg-blue-200 px-2 py-1 rounded-full">{cat}</button>
            ))}
            <button className="bg-gradient-to-r from-orange-400 to-orange-300 text-white px-2 py-1 rounded-full">All</button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {groceries.map((item, idx) => (
              <label key={idx} className="flex items-center gap-2">
                <input type="checkbox" className="accent-blue-500" />
                <span className={`${["Bread", "Spinach", "Kidney Beans"].includes(item) ? "line-through text-gray-400" : ""}`}>
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;
