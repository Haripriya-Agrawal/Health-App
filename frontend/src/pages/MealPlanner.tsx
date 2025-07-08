import Navbar from "../components/Navbar";


const MealPlanner: React.FC = () => {
  return (
    <div className="min-h-screen bg-blue-200 p-4">
      <Navbar />
      <h1 className="text-center text-3xl font-bold text-white mb-6">Meal Planner</h1>

      <div className="flex flex-wrap gap-6 justify-center">
        {/* Left Section */}
        <div className="bg-pink-50 p-4 rounded-3xl shadow-md border-2 border-blue-400 w-[700px]">
          {/* Breakfast */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Breakfast</h2>
            <div className="flex flex-col gap-2">
              <button className="bg-orange-300 text-white px-4 py-2 rounded-full shadow">Generate meals based on available groceries</button>
              <button className="bg-orange-300 text-white px-4 py-2 rounded-full shadow">Manually enter meal</button>
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
            <button className="bg-orange-300 text-white px-4 py-2 rounded-full shadow">Calculate Macros</button>
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

          <div className="flex justify-center gap-2 mb-4">
            <button className="bg-orange-300 text-white px-3 py-1 rounded-full text-sm">Add Items</button>
            <button className="bg-orange-300 text-white px-3 py-1 rounded-full text-sm">Meal Ideas</button>
            <button className="bg-orange-300 text-white px-3 py-1 rounded-full text-sm">To buy</button>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-4 text-sm">
            <button className="bg-blue-200 px-2 py-1 rounded-full">Fresh Produce</button>
            <button className="bg-blue-200 px-2 py-1 rounded-full">Dairy</button>
            <button className="bg-blue-200 px-2 py-1 rounded-full">Grains & Pulses</button>
            <button className="bg-blue-200 px-2 py-1 rounded-full">Drinks & Snacks</button>
            <button className="bg-blue-200 px-2 py-1 rounded-full">Misc</button>
            <button className="bg-orange-300 px-2 py-1 rounded-full">All</button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {['Broccoli','Cauliflower','Bhindi','Bread','Milk','Paneer','Potato','Chana','Mustard Oil','Kidney Beans','Tomato','Spinach','Carrot','Masoor Dal','Almond','Walnut'].map((item, idx) => (
              <label key={idx} className="flex items-center gap-2">
                <input type="checkbox" className="accent-blue-500" />
                <span className={`${['Bread','Spinach','Kidney Beans'].includes(item) ? 'line-through text-gray-400' : ''}`}>{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;
