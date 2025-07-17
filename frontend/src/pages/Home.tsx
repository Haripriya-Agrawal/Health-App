import React from 'react';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
  return (
    
    <div className="min-h-screen bg-lightblue text-darkblue p-8">
      
         <Navbar />
      
      
     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-12 max-w-6xl mx-auto">
        {/* Today's Weight Section */}
        <div className="bg-white p-6 rounded-[30px] shadow-md ">
          <h2 className="text-blue text-center font-bold text-xl mb-6 ">Today's Weight</h2>
          <div className="space-y-4">
            <div>
              {/* <label className="block text-darkblue mb-2">Enter Weight</label> */}
              <input
                type="text"
                className="w-full p-3  rounded-[30px] bg-gradient-to-r from-[#F37748] to-[#ECC30B] focus:outline-none focus:ring-2 focus:ring-white placeholder: text-center placeholder-white"
                placeholder="Enter weight"
              />
            </div>
            <div>
              <label className="block text-darkblue mb-2">Measured When ?</label>
              <input
                type="text"
                className="w-full p-3 border border-lightblue rounded-[30px] bg-white focus:outline-none focus:ring-2 focus:ring-white  placeholder: text-center  placeholder-white"
                placeholder="Measurement time"
              />
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="bg-white p-6 rounded-[30px]  shadow-md ">
          <h2 className="text-blue text-center font-bold text-xl mb-6">Activity</h2>
          <ul className="space-y-3 text-white text-center">
            {['Steps', 'Intensity', 'Duration', 'Activity Type'].map((item) => (
              <li key={item} className="flex items-center">
                {/* <span className="text-orange mr-2">-</span> */}
                <input
                  type="text"
                  className="flex-1 p-3  text-[#FFFFF] bg-gradient-to-r from-[#84BCDA] to-[#F37748] rounded-[30px] bg-white focus:outline-none focus:ring-2 focus:ring-white placeholder: text-center  placeholder-white"
                  placeholder={item}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Meals Section */}
        <div className="bg-white p-6 rounded-[30px]  shadow-md ">
          <h2 className="text-blue text-center font-bold text-xl mb-6">Meals</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
  {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map((meal) => (
    <div key={meal} className="relative">
      <label htmlFor={meal.toLowerCase()} className="sr-only">Enter {meal}</label>
      <input
        id={meal.toLowerCase()}
        type="text"
        className="w-full bg-lightblue hover:bg-midblue text-darkblue hover:text-white py-2 px-4 rounded-[30px] transition-colors duration-200 border-none focus:ring-2 focus:ring-white focus:outline-none  placeholder: text-center placeholder-white"
        placeholder={`Enter ${meal}`}
      />
    </div>
  ))}
</div>
          <button className="w-full bg-orange hover:bg-yellow text-white py-2 px-4 rounded-[30px] font-medium transition-colors duration-200">
            Import from meal planner
          </button>
        </div>

        {/* Macros Section */}
        <div className="bg-white p-6 rounded-[30px]  shadow-md ">
          <h2 className="text-blue  text-center font-bold text-xl mb-6">Macros</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left pb-2">Overall</th>
                  {[1, 2, 3, 4].map((num) => (
                    <th key={num} className="text-center pb-2">
                      {num}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-lightblue">
                <tr>
                  <td className="py-2">Calories: 1306</td>
                  {[30, 30, 30, 30].map((val, i) => (
                    <td key={i} className="text-center py-2">
                      {val}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2">Protein: 50g</td>
                  {[120, 120, 120, 120].map((val, i) => (
                    <td key={i} className="text-center py-2">
                      {val}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2">Carbs: 234g</td>
                  {[25, 25, 25, 25].map((val, i) => (
                    <td key={i} className="text-center py-2">
                      {val}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2">Fat: 50g</td>
                  {[10, 10, 10, 10].map((val, i) => (
                    <td key={i} className="text-center py-2">
                      {val}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2">Fibre: 35g</td>
                  <td colSpan={4} className="text-center py-2"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;