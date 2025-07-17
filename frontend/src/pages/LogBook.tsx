import React from 'react';
import Navbar from '../components/Navbar';

const data = [
  { date: '12/02/24', calories: '1343', carbs: '200', protein: '90', fats: '50', fibre: '35' },
  { date: '13/02/24', calories: '1343', carbs: '200', protein: '90', fats: '50', fibre: '35' },
  { date: '14/02/24', calories: '2000', carbs: '200', protein: '90', fats: '50', fibre: '35', highlight: 'orange' },
  { date: '15/02/24', calories: '1343', carbs: '200', protein: '90', fats: '50', fibre: '35' },
  { date: '16/02/24', calories: '1343', carbs: '200', protein: '90', fats: '50', fibre: '35', highlight: 'blue' },
  { date: '17/02/24', calories: '3000', carbs: '200', protein: '90', fats: '50', fibre: '35', highlight: 'orange' },
  { date: '18/02/24', calories: '1343', carbs: '200', protein: '90', fats: '50', fibre: '35' },
  { date: '19/02/24', calories: '1343', carbs: '200', protein: '90', fats: '50', fibre: '35' },
];

const LogBook: React.FC = () => {
  return (
    <div className="min-h-screen bg-lightblue p-2 md:p-4">
      <Navbar />

      <div className="max-w-4xl mx-auto bg-white rounded-xl md:rounded-2xl p-3 md:p-4 mt-20 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-separate border-spacing-y-1 text-sm md:text-base">
            <thead>
              <tr className="font-bold text-gray-800">
                <th className="p-2">Date</th>
                <th className="p-2">Calories</th>
                <th className="p-2">Carbs</th>
                <th className="p-2">Protein</th>
                <th className="p-2">Fats</th>
                <th className="p-2">Fibre</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry, index) => (
                <tr
                  key={index}
                  className={`
                    transition-colors duration-200
                    ${entry.highlight === 'orange'
                      ? 'bg-orange-100 hover:bg-orange-200'
                      : entry.highlight === 'blue'
                      ? 'bg-blue-100 hover:bg-blue-200'
                      : 'bg-white hover:bg-lightblue hover:bg-opacity-50'}
                    cursor-pointer
                  `}
                >
                  <td className="p-2 rounded-l-lg">{entry.date}</td>
                  <td className="p-2">{entry.calories} kcal</td>
                  <td className="p-2">{entry.carbs}g</td>
                  <td className="p-2">{entry.protein}g</td>
                  <td className="p-2">{entry.fats}g</td>
                  <td className="p-2 rounded-r-lg">{entry.fibre}g</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
          <button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-3 py-1.5 text-sm md:px-4 md:py-2 rounded-full shadow-md transition-all duration-200">
            Import as CSV ⬇️
          </button>
          <button className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white px-3 py-1.5 text-sm md:px-4 md:py-2 rounded-full shadow-md transition-all duration-200">
            View Trends 📈
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogBook;