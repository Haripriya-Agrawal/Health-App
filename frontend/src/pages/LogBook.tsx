// src/pages/LogBook.tsx
import React from 'react';
import Navbar from '../components/Navbar';

const data = [
  { date: '12/02/24', calories: '1343 kcals', carbs: '200g', protein: '90g', fats: '50g', fibre: '35g' },
  { date: '13/02/24', calories: '1343 kcals', carbs: '200g', protein: '90g', fats: '50g', fibre: '35g' },
  { date: '14/02/24', calories: '2000 kcals', carbs: '200g', protein: '90g', fats: '50g', fibre: '35g', highlight: 'orange' },
  { date: '15/02/24', calories: '1343 kcals', carbs: '200g', protein: '90g', fats: '50g', fibre: '35g' },
  { date: '16/02/24', calories: '1343 kcals', carbs: '200g', protein: '90g', fats: '50g', fibre: '35g', highlight: 'blue' },
  { date: '17/02/24', calories: '3000 kcals', carbs: '200g', protein: '90g', fats: '50g', fibre: '35g', highlight: 'orange' },
  { date: '18/02/24', calories: '1343 kcals', carbs: '200g', protein: '90g', fats: '50g', fibre: '35g' },
  { date: '19/02/24', calories: '1343 kcals', carbs: '200g', protein: '90g', fats: '50g', fibre: '35g' },
];

const LogBook: React.FC = () => {
  return (
    <div className="min-h-screen bg-lightblue p-4">
      <Navbar />

      <div className="max-w-5xl mx-auto bg-pink-50 rounded-3xl p-6 shadow-md">
        <table className="w-full text-center border-separate border-spacing-y-2">
          <thead>
            <tr className="text-lg font-bold text-gray-800">
              <th>Date</th>
              <th>Calories</th>
              <th>Carbs</th>
              <th>Protein</th>
              <th>Fats</th>
              <th>Fibre</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr
                key={index}
                className={
                  entry.highlight === 'orange'
                    ? 'bg-orange-200 rounded-lg'
                    : entry.highlight === 'blue'
                    ? 'bg-blue-200 rounded-lg'
                    : ''
                }
              >
                <td>{entry.date}</td>
                <td>{entry.calories}</td>
                <td>{entry.carbs}</td>
                <td>{entry.protein}</td>
                <td>{entry.fats}</td>
                <td>{entry.fibre}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center gap-4 mt-6">
          <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-full shadow-md">
            Import as CSV ⬇️
          </button>
          <button className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-4 py-2 rounded-full shadow-md">
            View Trends 📈
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogBook;
