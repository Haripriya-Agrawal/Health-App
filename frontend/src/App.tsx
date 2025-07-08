import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LogBook from './pages/LogBook';
import Trends from './pages/Trends';
import MealPlanner from './pages/MealPlanner';
import Goals from './pages/Goals';
import SignupPage from './pages/SignUp';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<SignupPage/>} />
      <Route path="/home" element={<Home/>} />
      <Route path="/logbook" element={<LogBook />} />
      <Route path="/trends" element={<Trends />} />
      <Route path="/meal-planner" element={<MealPlanner />} />
      <Route path="/goals" element={<Goals />} />
    </Routes>
  );
};

export default App;
