import React, { useState } from 'react';
import Navbar from '../components/Navbar';

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  selected: boolean;
}

interface Meal {
  name: string;
  items: string[];
}

interface MacroInfo {
  calories: number;
  carbs: number;
  protein: number;
  fibre: number;
}

interface NewItem {
  name: string;
  qty: string;
  category: string;
  unit: string;
}

const MealPlannerApp: React.FC = () => {
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([
    { id: 'broccoli', name: 'Broccoli', category: 'Fresh Produce', selected: false },
    { id: 'cauliflower', name: 'Cauliflower', category: 'Fresh Produce', selected: false },
    { id: 'bhindi', name: 'Bhindi', category: 'Fresh Produce', selected: false },
    { id: 'bread', name: 'Bread', category: 'Grains & Pulses', selected: true },
    { id: 'milk', name: 'Milk', category: 'Dairy', selected: false },
    { id: 'paneer', name: 'Paneer', category: 'Dairy', selected: false },
    { id: 'potato', name: 'Potato', category: 'Fresh Produce', selected: false },
    { id: 'chana', name: 'Chana', category: 'Grains & Pulses', selected: false },
    { id: 'mustardOil', name: 'Mustard Oil', category: 'Misc', selected: false },
    { id: 'kidneyBeans', name: 'Kidney Beans', category: 'Grains & Pulses', selected: false },
    { id: 'tomato', name: 'Tomato', category: 'Fresh Produce', selected: false },
    { id: 'spinach', name: 'Spinach', category: 'Fresh Produce', selected: true },
    { id: 'carrot', name: 'Carrot', category: 'Fresh Produce', selected: false },
    { id: 'masoorDal', name: 'Masoor Dal', category: 'Grains & Pulses', selected: false },
    { id: 'almond', name: 'Almond', category: 'Misc', selected: false },
    { id: 'walnut', name: 'Walnut', category: 'Misc', selected: false }
  ]);

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newItem, setNewItem] = useState<NewItem>({
    name: '',
    qty: '',
    category: 'Fresh Produce',
    unit: 'kg'
  });

  const toggleItem = (id: string) => {
    setGroceryItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleAddItem = () => {
    if (newItem.name.trim()) {
      const id = newItem.name.toLowerCase().replace(/\s+/g, '');
      const newGroceryItem: GroceryItem = {
        id,
        name: newItem.name,
        category: newItem.category,
        selected: false
      };
      
      setGroceryItems(prev => [...prev, newGroceryItem]);
      setNewItem({
        name: '',
        qty: '',
        category: 'Fresh Produce',
        unit: 'kg'
      });
      setShowAddModal(false);
    }
  };

  const units = ['kg', 'g', 'l', 'ml', 'pcs', 'dozen', 'packet'];

  const categories = ['Fresh Produce', 'Dairy', 'Grains & Pulses', 'Drinks & Snacks', 'Misc', 'All'];

  const filteredItems = activeCategory === 'All' 
    ? groceryItems 
    : groceryItems.filter(item => item.category === activeCategory);

  const lunchMeal: Meal = {
    name: "2 Ragi Dosas With Sambar & Chutney",
    items: ["Veggie Bowl", "Papad, Roasted"]
  };

  const dinnerMeal: Meal = {
    name: "2 Ragi Dosas With Sambar & Chutney",
    items: ["Veggie Bowl", "Papad, Roasted"]
  };

  const macros: MacroInfo = {
    calories: 500,
    carbs: 120,
    protein: 18,
    fibre: 12
  };

  

  return (
    <div className="min-h-screen bg-lightblue  p-6">
      <Navbar />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Meal Planner Section */}
        <div className="lg:col-span-2">
          {/* <h1 className="text-4xl font-bold text-white text-center mb-8">Meal Planner</h1> */}
          
          <div className="bg-white backdrop-blur-md rounded-3xl p-8">
            {/* 2x2 Grid Layout: Breakfast-Lunch on top, Snacks-Dinner on bottom */}
            <div className="grid grid-cols-2 gap-6">
              {/* Breakfast Section */}
              <div className="bg-white border border-[#84BCDA] rounded-2xl p-6">
                <h2 className="text-2xl font-semibold text-blue-800 text-center mb-4">Breakfast</h2>
                <div className="space-y-4">
                  <button className="w-full bg-orange-400 hover:bg-orange-500 text-white font-medium py-3 px-6 rounded-xl transition-colors">
                    Generate meals based on available groceries
                  </button>
                  <button className="w-full bg-orange-400 hover:bg-orange-500 text-white font-medium py-3 px-6 rounded-xl transition-colors">
                    Manually enter meal
                  </button>
                </div>
              </div>

              {/* Lunch Section */}
              <div className="bg-white border border-[#84BCDA]  rounded-2xl p-6">
                <h2 className="text-2xl font-semibold text-blue-800 text-center mb-4">Lunch</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-lightblue rounded-xl p-4">
                    <h3 className="font-semibold text-white mb-2">Meal</h3>
                    <p className="text-white text-sm mb-2">{lunchMeal.name}</p>
                    {lunchMeal.items.map((item, index) => (
                      <p key={index} className="text-white text-sm">{item}</p>
                    ))}
                  </div>
                  <div className="bg-lightblue rounded-xl p-4">
                    <h3 className="font-semibold text-white mb-2">Macros</h3>
                    <p className="text-white text-sm">Calories: {macros.calories} kcal</p>
                    <p className="text-white text-sm">Carbs: {macros.carbs}g</p>
                    <p className="text-white text-sm">Protein: {macros.protein}g</p>
                    <p className="text-white text-sm">Fibre: {macros.fibre}g</p>
                  </div>
                </div>
              </div>

              {/* Snacks Section */}
              <div className="bg-white border border-[#84BCDA]  rounded-2xl p-6">
                <h2 className="text-2xl font-semibold text-blue-800 text-center mb-4">Snacks</h2>
                <div className="bg-lightblue rounded-xl p-8 mb-4">
                  <p className="text-white text-center text-lg">Enter Meal</p>
                </div>
                <div className="text-center">
                  <button className="bg-orange-400 hover:bg-orange-500 text-white font-medium py-3 px-8 rounded-xl transition-colors">
                    Calculate Macros
                  </button>
                </div>
              </div>

              {/* Dinner Section */}
              <div className="bg-white border border-[#84BCDA]  rounded-2xl p-6">
                <h2 className="text-2xl font-semibold text-blue-800 text-center mb-4">Dinner</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-lightblue rounded-xl p-4">
                    <h3 className="font-semibold text-white mb-2">Meal</h3>
                    <p className="text-white text-sm mb-2">{dinnerMeal.name}</p>
                    {dinnerMeal.items.map((item, index) => (
                      <p key={index} className="text-white text-sm">{item}</p>
                    ))}
                  </div>
                  <div className="bg-lightblue rounded-xl p-4">
                    <h3 className="font-semibold text-white mb-2">Macros</h3>
                    <p className="text-white text-sm">Calories: {macros.calories} kcal</p>
                    <p className="text-white text-sm">Carbs: {macros.carbs}g</p>
                    <p className="text-white text-sm">Protein: {macros.protein}g</p>
                    <p className="text-white text-sm">Fibre: {macros.fibre}g</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Groceries Section */}
        <div className="lg:col-span-1">
          {/* <h1 className="text-4xl font-bold text-white text-center mb-8">Groceries</h1> */}
          
          <div className="bg-white backdrop-blur-md rounded-3xl p-6">
            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-orange-400 hover:bg-orange-500 text-white font-medium py-2 px-4 rounded-xl transition-colors"
              >
                Add Items
              </button>
              <button className="bg-orange-400 hover:bg-orange-500 text-white font-medium py-2 px-4 rounded-xl transition-colors">
                To buy
              </button>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    activeCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-200 text-blue-800 hover:bg-blue-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Grocery Items */}
            <div className="grid grid-cols-2 gap-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-3 p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={`w-5 h-5 rounded-full border-2 transition-colors ${
                      item.selected
                        ? 'bg-blue border-blue-500'
                        : 'border-blue-300 hover:border-blue-400'
                    }`}
                  >
                    {item.selected && (
                      <div className="w-full h-full rounded-full bg-blue-500"></div>
                    )}
                  </button>
                  <span className={`text-sm ${
                    item.selected ? 'text-blue-300 line-through' : 'text-blue'
                  }`}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Item Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-blue mb-6 text-center">Add New Item</h2>
            
            <div className="space-y-4">
              {/* Item Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter item name"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="text"
                  value={newItem.qty}
                  onChange={(e) => setNewItem(prev => ({ ...prev, qty: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter quantity"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Fresh Produce">Fresh Produce</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Grains & Pulses">Grains & Pulses</option>
                  <option value="Drinks & Snacks">Drinks & Snacks</option>
                  <option value="Misc">Misc</option>
                </select>
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <select
                  value={newItem.unit}
                  onChange={(e) => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                className="flex-1 bg-orange-400 hover:bg-orange-500 text-white font-medium py-2 px-4 rounded-xl transition-colors"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlannerApp;