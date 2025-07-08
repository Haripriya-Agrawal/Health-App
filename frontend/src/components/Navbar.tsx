import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full shadow-lg w-fit mx-auto my-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <span className="text-xl font-semibold">👤</span>
        </div>
        <Link to="/home" className="text-white font-medium">Home</Link>
        <Link to="/logbook" className="text-white font-medium">LogBook</Link>
        <Link to="/trends" className="text-white font-medium">Trends</Link>
        <Link to="/meal-planner" className="text-white font-medium">Meal Planner</Link>
        <Link to="/goals" className="text-white font-medium">Goals</Link>
      </div>
      <button className="bg-white text-blue-600 px-4 py-1 rounded-full font-semibold shadow-md">Ask Pebbl 🔘</button>
    </nav>
  );
};

export default Navbar;
