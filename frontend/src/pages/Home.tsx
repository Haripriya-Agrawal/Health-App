import React from 'react';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-lightblue p-4">
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {/* Today's Weight */}
        <div className="bg-pink-50 p-4 rounded-3xl shadow-md">
          <h2 className="text-blue-600 font-semibold text-lg mb-4">Today's Weight</h2>
          <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white w-full py-2 rounded-full mb-4 font-semibold">Enter Weight</button>
          <p className="text-center text-sm text-gray-600">Measured When?</p>
          <div className="flex justify-center gap-4 mt-2 text-2xl">
            <span>🌞</span>
            <span>🌼</span>
            <span>🌙</span>
          </div>
        </div>

        {/* Activity */}
        <div className="bg-pink-50 p-4 rounded-3xl shadow-md">
          <h2 className="text-blue-600 font-semibold text-lg mb-4">Activity</h2>
          <div className="flex flex-col gap-2">
            <input className="bg-gradient-to-r from-orange-400 to-blue-300 text-white py-2 px-4 rounded-full" placeholder="Steps" />
            <input className="bg-gradient-to-r from-orange-400 to-blue-300 text-white py-2 px-4 rounded-full" placeholder="Duration" />
            <select className="bg-gradient-to-r from-orange-400 to-blue-300 text-white py-2 px-4 rounded-full">
              <option>Intensity</option>
            </select>
            <select className="bg-gradient-to-r from-orange-400 to-blue-300 text-white py-2 px-4 rounded-full">
              <option>Activity Type</option>
            </select>
          </div>
        </div>

        {/* Meals */}
        <div className="bg-pink-50 p-4 rounded-3xl shadow-md">
          <h2 className="text-blue-600 font-semibold text-lg mb-4">Meals</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-gradient-to-r from-blue-300 to-orange-400 text-white py-2 rounded-full">Enter Breakfast</button>
            <button className="bg-gradient-to-r from-blue-300 to-orange-400 text-white py-2 rounded-full">Enter Lunch</button>
            <button className="bg-gradient-to-r from-blue-300 to-orange-400 text-white py-2 rounded-full">Enter Snacks</button>
            <button className="bg-gradient-to-r from-blue-300 to-orange-400 text-white py-2 rounded-full">Enter Dinner</button>
          </div>
          <button className="mt-4 bg-blue-300 text-white py-2 px-4 rounded-full w-full">Import from meal planner</button>
        </div>

        {/* Macros */}
        <div className="bg-pink-50 p-4 rounded-3xl shadow-md">
          <h2 className="text-blue-600 font-semibold text-lg mb-4">Macros</h2>
          <p className="mb-2 font-medium">Overall</p>
          <div className="text-sm space-y-1">
            <p>Calories: 1306</p>
            <p>Protein: 50g</p>
            <p>Carbs: 234g</p>
            <p>Fat: 50g</p>
            <p>Fibre: 35g</p>
          </div>
          <div className="flex justify-between mt-4 text-lg">
            <span>🌞</span>
            <span>🌼</span>
            <span>🍅</span>
            <span>🌙</span>
          </div>
          <div className="grid grid-cols-4 gap-1 text-center text-sm mt-2">
            <div>200</div>
            <div>200</div>
            <div>200</div>
            <div>200</div>
            <div>30</div>
            <div>30</div>
            <div>30</div>
            <div>30</div>
            <div>120</div>
            <div>120</div>
            <div>120</div>
            <div>120</div>
            <div>25</div>
            <div>25</div>
            <div>25</div>
            <div>25</div>
            <div>10</div>
            <div>10</div>
            <div>10</div>
            <div>10</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;