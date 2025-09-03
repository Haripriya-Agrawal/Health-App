import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";

import pantryService from "../services/pantryService";


import type { MealPlan } from "../services/mealPlanService";
import { mealPlanService } from "../services/mealPlanService"; // ✅ FIXED missing import
import aiMealService from "../services/aiMealService";
import nutritionixService from "../services/nutritionixService";
import { dailyLogService } from "../services/dailyLogService";

// ---------- Local types ----------
type MealType = "breakfast" | "lunch" | "dinner" | "snack";

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  selected: boolean;
}

interface MealCardData {
  name: string;
  macros: { calories: number; carbs: number; protein: number; fibre: number };
}

interface NewItem {
  name: string;
  qty: string;
  category: string;
  unit: string;
  toBuy: boolean;
}

// ---------- Helpers ----------
const todayISO = () => new Date().toISOString().slice(0, 10);
const mondayOf = (iso: string) => {
  const d = new Date(iso);
  const diff = (d.getDay() === 0 ? -6 : 1) - d.getDay();
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
};

const ALLOWED_UNITS = ["kg", "g", "l", "ml", "pcs", "dozen", "packet"] as const;
type AllowedUnit = (typeof ALLOWED_UNITS)[number];
const normalizeUnit = (u: string): AllowedUnit =>
  (ALLOWED_UNITS as readonly string[]).includes((u || "").toLowerCase())
    ? ((u || "").toLowerCase() as AllowedUnit)
    : "pcs";

// ---------- Component ----------
const MealPlannerApp: React.FC = () => {
  // ---- Pantry state
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showToBuy, setShowToBuy] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState<NewItem>({
    name: "",
    qty: "",
    category: "Fresh Produce",
    unit: "kg",
    toBuy: false,
  });

  // ---- Plan + Meals state
  const [plan, setPlan] = useState<MealPlan | null>(null); // ✅ typed
  const [cards, setCards] = useState<Record<MealType, MealCardData>>({
    breakfast: { name: "—", macros: { calories: 0, carbs: 0, protein: 0, fibre: 0 } },
    lunch: { name: "—", macros: { calories: 0, carbs: 0, protein: 0, fibre: 0 } },
    dinner: { name: "—", macros: { calories: 0, carbs: 0, protein: 0, fibre: 0 } },
    snack: { name: "—", macros: { calories: 0, carbs: 0, protein: 0, fibre: 0 } },
  });
  const [manualModal, setManualModal] = useState<{ open: boolean; mealType: MealType | null; text: string }>({
    open: false,
    mealType: null,
    text: "",
  });

  // ---- Load pantry + plan
  useEffect(() => {
    (async () => {
      try {
        const pantry = await pantryService.list();
        setGroceryItems(
          (pantry || []).map((p: any) => ({
            id: String(p._id),
            name: p.name,
            category: (p.tags && p.tags[0]) || "Misc",
            unit: p.unit || "pcs",
            selected: (p.qty ?? 0) > 0,
          }))
        );

        const mp = await mealPlanService.get(mondayOf(todayISO()));
        setPlan(mp);

        // Hydrate today's meals
        if (mp) {
          const todayRows = (mp.meals || []).filter((m: any) => m.date === todayISO());
          const byType: Record<string, any> = {};
          todayRows.forEach((m) => (byType[m.mealType] = m));

          setCards((prev) => {
            const out = { ...prev };
            (["breakfast", "lunch", "dinner", "snack"] as MealType[]).forEach((type) => {
              if (byType[type]) {
                out[type] = {
                  name: byType[type].name,
                  macros: byType[type].macros || { calories: 0, carbs: 0, protein: 0, fibre: 0 },
                };
              }
            });
            return out;
          });
        }
      } catch (e) {
        console.error("MealPlanner load failed:", e);
      }
    })();
  }, []);

  // ---- Pantry toggle
  const toggleItem = async (id: string) => {
    setGroceryItems((prev) => prev.map((i) => (i.id === id ? { ...i, selected: !i.selected } : i)));
    const item = groceryItems.find((i) => i.id === id);
    const goingToSelected = item ? !item.selected : true;
    await pantryService.updateQty(id, goingToSelected ? 1 : 0);
  };

  // ---- Pantry add
  const handleAddItem = async () => {
    const name = newItem.name.trim();
    if (!name) return alert("Please enter an item name.");

    const raw = (newItem.qty ?? "").toString().trim();
    const qtyParsed = newItem.toBuy ? 0 : raw === "" ? 1 : Number(raw);
    const qtyNum = Number.isFinite(qtyParsed) && qtyParsed >= 0 ? qtyParsed : newItem.toBuy ? 0 : 1;
    const unitToSend = normalizeUnit(newItem.unit);

    try {
      const created = await pantryService.upsert({
        name,
        unit: unitToSend,
        qty: qtyNum,
        tags: [newItem.category],
      });

      setGroceryItems((prev) => [
        ...prev,
        {
          id: String(created._id),
          name: created.name,
          category: newItem.category,
          unit: unitToSend,
          selected: (created.qty ?? 0) > 0,
        },
      ]);

      if (newItem.toBuy) setShowToBuy(true);
      setNewItem({ name: "", qty: "", category: "Fresh Produce", unit: "kg", toBuy: false });
      setShowAddModal(false);
    } catch (err: any) {
      console.error("Add pantry item failed:", err?.response?.data || err);
      alert("Couldn't add item.");
    }
  };

  // ---- Save meal to backend
  const saveMealToPlan = async (mealType: MealType, name: string, macros: any) => {
    let mp = plan;
    if (!mp?._id) {
      mp = await mealPlanService.generate(mondayOf(todayISO()));
    }

    const updatedMeals = [
      ...(mp?.meals || []).filter((m: any) => !(m.date === todayISO() && m.mealType === mealType)),
      { date: todayISO(), mealType, name, macros },
    ];

    const updated = await mealPlanService.update({ ...mp, meals: updatedMeals });
    setPlan(updated);

    setCards((prev) => ({ ...prev, [mealType]: { name, macros } }));
  };

  // ---- Meal actions
  const onGenerateFromPantry = async (mealType: MealType) => {
    try {
      const available = groceryItems.filter((g) => g.selected).map((g) => ({ name: g.name, unit: g.unit }));
      const result = await aiMealService.suggest({ mealType, pantry: available });
      const macros = {
        calories: result.macros?.calories || 0,
        carbs: result.macros?.carbs || 0,
        protein: result.macros?.protein || 0,
        fibre: (result.macros?.fibre ?? result.macros?.fiber) || 0,
      };
      await saveMealToPlan(mealType, result.name || "Generated Meal", macros);
    } catch {
      alert("AI meal generation failed");
    }
  };

  const submitManualEntry = async () => {
    if (!manualModal.mealType || !manualModal.text.trim()) {
      setManualModal({ open: false, mealType: null, text: "" });
      return;
    }

    try {
      const parsed = await nutritionixService.analyze({ query: manualModal.text });
      const macros = {
        calories: parsed.macros?.calories || 0,
        carbs: parsed.macros?.carbs || 0,
        protein: parsed.macros?.protein || 0,
        fibre: (parsed.macros?.fibre ?? parsed.macros?.fiber) || 0,
      };
      await saveMealToPlan(manualModal.mealType, parsed.name || manualModal.text, macros);
    } finally {
      setManualModal({ open: false, mealType: null, text: "" });
    }
  };

  
// ---- MealCard component
const MealCard: React.FC<{ title: string; mealType: MealType }> = ({ title, mealType }) => {
  const c = cards[mealType];

  // Clear meal and return to buttons
  const resetMeal = () => {
    setCards((prev) => ({
      ...prev,
      [mealType]: {
        name: "—",
        macros: { calories: 0, carbs: 0, protein: 0, fibre: 0 },
      },
    }));
    if (plan?._id) {
      const updatedMeals = (plan.meals || []).filter(
        (m: any) => !(m.date === todayISO() && m.mealType === mealType)
      );
      mealPlanService.update({ ...plan, meals: updatedMeals }).then(setPlan);
    }
  };

  // Log this meal to DailyLog
  const logAsToday = async () => {
    try {
      await dailyLogService.addEntry({
        date: todayISO(),
        mealType,
        name: c.name,
        macros: c.macros,
      });
      alert(`${title} logged successfully!`);
    } catch (err) {
      console.error("Failed to log meal:", err);
      alert("Could not log meal.");
    }
  };

  return (
    <div className="bg-white border border-[#84BCDA] rounded-2xl p-6">
      <h2 className="text-2xl font-semibold text-blue-800 text-center mb-4">{title}</h2>

      {c.name === "—" ? (
        // When no meal exists → show buttons
        <div className="space-y-3">
          <button
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-medium py-3 px-6 rounded-xl"
            onClick={() => onGenerateFromPantry(mealType)}
          >
            Generate meals based on available groceries
          </button>
          <button
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-medium py-3 px-6 rounded-xl"
            onClick={() => setManualModal({ open: true, mealType, text: "" })}
          >
            Manually enter meal
          </button>
        </div>
      ) : (
        // When meal exists → show macros + Change + Log buttons
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-lightblue rounded-xl p-4">
              <h3 className="font-semibold text-white mb-2">Meal</h3>
              <p className="text-white text-sm">{c.name}</p>
            </div>
            <div className="bg-lightblue rounded-xl p-4">
              <h3 className="font-semibold text-white mb-2">Macros</h3>
              <p className="text-white text-sm">Calories: {c.macros.calories} kcal</p>
              <p className="text-white text-sm">Carbs: {c.macros.carbs} g</p>
              <p className="text-white text-sm">Protein: {c.macros.protein} g</p>
              <p className="text-white text-sm">Fibre: {c.macros.fibre} g</p>
            </div>
          </div>
          <div className="space-y-2">
            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-xl"
              onClick={logAsToday}
            >
              Log as today’s {title}
            </button>
            <button
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-xl"
              onClick={resetMeal}
            >
              Change Meal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


  // ---- Daily totals
  const totals = (["breakfast", "lunch", "dinner", "snack"] as MealType[]).reduce(
    (acc, mt) => {
      acc.calories += cards[mt].macros.calories;
      acc.carbs += cards[mt].macros.carbs;
      acc.protein += cards[mt].macros.protein;
      acc.fibre += cards[mt].macros.fibre;
      return acc;
    },
    { calories: 0, carbs: 0, protein: 0, fibre: 0 }
  );

  // ---- Render
  const categories = ["Fresh Produce", "Dairy", "Grains & Pulses", "Drinks & Snacks", "Misc", "All"];
  const filteredItems = useMemo(() => {
    if (showToBuy) return groceryItems.filter((i) => !i.selected);
    if (activeCategory === "All") return groceryItems.filter((i) => i.selected);
    return groceryItems.filter((i) => i.selected && i.category === activeCategory);
  }, [groceryItems, activeCategory, showToBuy]);

  return (
    <div className="min-h-screen bg-lightblue p-6">
      <Navbar />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Meal Planner */}
        <div className="lg:col-span-2">
          <div className="bg-white backdrop-blur-md rounded-3xl p-8">
            <div className="grid grid-cols-2 gap-6">
              <MealCard title="Breakfast" mealType="breakfast" />
              <MealCard title="Lunch" mealType="lunch" />
              <MealCard title="Snacks" mealType="snack" />
              <MealCard title="Dinner" mealType="dinner" />
            </div>
            <div className="mt-6 bg-lightblue rounded-xl p-4 text-white">
              <h3 className="font-semibold mb-2">Daily Totals</h3>
              <p>Calories: {totals.calories} kcal</p>
              <p>Carbs: {totals.carbs} g</p>
              <p>Protein: {totals.protein} g</p>
              <p>Fibre: {totals.fibre} g</p>
            </div>
          </div>
        </div>

        {/* Pantry */}
        <div className="lg:col-span-1">
          <div className="bg-white backdrop-blur-md rounded-3xl p-6">
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-orange-400 hover:bg-orange-500 text-white font-medium py-2 px-4 rounded-xl transition-colors"
              >
                Add Items
              </button>
              <button
                className={`${
                  showToBuy ? "bg-blue-500 text-white" : "bg-orange-400 hover:bg-orange-500 text-white"
                } font-medium py-2 px-4 rounded-xl transition-colors`}
                onClick={() => setShowToBuy((v) => !v)}
              >
                {showToBuy ? "Viewing: To buy" : "To buy"}
              </button>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setShowToBuy(false);
                    setActiveCategory(category);
                  }}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    !showToBuy && activeCategory === category
                      ? "bg-blue-500 text-white"
                      : "bg-blue-200 text-blue-800 hover:bg-blue-300"
                  } ${showToBuy ? "opacity-60 cursor-not-allowed" : ""}`}
                  disabled={showToBuy}
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
                  onClick={() => toggleItem(item.id)}
                  className="flex items-center space-x-3 p-2 hover:bg-white rounded-lg transition-colors cursor-pointer select-none"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleItem(item.id);
                    }}
                    className={`w-5 h-5 rounded-full border-2 transition-colors ${
                      item.selected ? "bg-blue border-blue-500" : "border-blue-300 hover:border-blue-400"
                    }`}
                  >
                    {item.selected && <div className="w-full h-full rounded-full bg-blue-500"></div>}
                  </button>
                  <span className={`text-sm ${item.selected ? "text-blue" : "text-blue-300 line-through"}`}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Manual Modal */}
      {manualModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-blue mb-6 text-center">Enter Meal Manually</h2>
            <textarea
              value={manualModal.text}
              onChange={(e) => setManualModal((m) => ({ ...m, text: e.target.value }))}
              className="w-full h-28 px-4 py-3 border border-gray-300 rounded-lg"
              placeholder='e.g., "2 ragi dosa with sambar"'
            />
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setManualModal({ open: false, mealType: null, text: "" })}
                className="flex-1 bg-gray-300 py-2 px-4 rounded-xl"
              >
                Cancel
              </button>
              <button onClick={submitManualEntry} className="flex-1 bg-orange-400 text-white py-2 px-4 rounded-xl">
                Analyze & Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-blue mb-6 text-center">Add New Item</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Item Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Quantity</label>
                <input
                  type="text"
                  value={newItem.qty}
                  onChange={(e) => setNewItem((prev) => ({ ...prev, qty: e.target.value }))}
                  className="w-full border px-3 py-2 rounded-lg"
                  disabled={newItem.toBuy}
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full border px-3 py-2 rounded-lg"
                >
                  <option value="Fresh Produce">Fresh Produce</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Grains & Pulses">Grains & Pulses</option>
                  <option value="Drinks & Snacks">Drinks & Snacks</option>
                  <option value="Misc">Misc</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2">Unit</label>
                <select
                  value={newItem.unit}
                  onChange={(e) => setNewItem((prev) => ({ ...prev, unit: e.target.value }))}
                  className="w-full border px-3 py-2 rounded-lg"
                >
                  {ALLOWED_UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="toBuy"
                  type="checkbox"
                  checked={newItem.toBuy}
                  onChange={(e) => setNewItem((prev) => ({ ...prev, toBuy: e.target.checked }))}
                />
                <label htmlFor="toBuy" className="text-sm">
                  Add to <b>To buy</b> (mark as out of stock)
                </label>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-300 py-2 rounded-lg">
                Cancel
              </button>
              <button onClick={handleAddItem} className="flex-1 bg-orange-400 text-white py-2 rounded-lg">
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