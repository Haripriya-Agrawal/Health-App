import  { useState } from 'react';
import { Edit3, Plus, Minus, Check, X } from 'lucide-react';
import Navbar from '../components/Navbar';


const ProgressCircle = ({ percentage, value }: { percentage: number; value: string }) => (
  <div className="relative w-24 h-24 rounded-full border-[6px] border-orange-400 flex items-center justify-center">
    <div className="text-center text-blue font-bold">
      <div>{percentage}%</div>
      <div className="text-xs text-blue-500">{value}</div>
    </div>
  </div>
);

const ProgressBar = ({ label, current, total }: { label: string; current: number; total: number }) => (
  <div className="mb-2">
    <div className="flex justify-between text-xs text-blue font-semibold">
      <span>{label}</span>
      <span>
        {current}
        {label === "Calories" ? "kcal" : label === "Fibre" ? "g" : "g"}/
        {total}
        {label === "Calories" ? "kcal" : label === "Fibre" ? "g" : "g"}
      </span>
    </div>
    <div className="w-full h-2 bg-orange-100 rounded-full">
      <div
        className="h-2 bg-orange-400 rounded-full"
        style={{ width: `${(current / total) * 100}%` }}
      ></div>
    </div>
  </div>
);

const Goals = () => {
  const [goals, setGoals] = useState({
    steps: {
      current: 3000,
      target: 10000,
      editing: false
    },
    weight: {
      current: 40,
      target: 50,
      editing: false
    },
    workout: {
      type: "Leg Day",
      duration: 45,
      editing: false
    },
    macros: {
      calories: { current: 400, target: 1200 },
      carbs: { current: 120, target: 200 },
      protein: { current: 80, target: 120 },
      fibre: { current: 20, target: 40 },
      editing: false
    },
    streak: {
      count: 5,
      editing: false
    }
  });

  const [editValues, setEditValues] = useState({
    stepsTarget: 0,
    weightTarget: 0,
    workoutType: '',
    workoutDuration: 0,
    caloriesTarget: 0,
    carbsTarget: 0,
    proteinTarget: 0,
    fibreTarget: 0
  });

  const handleEdit = (type: string) => {
    if (type === 'steps') {
      setGoals(prev => ({
        ...prev,
        steps: { ...prev.steps, editing: true }
      }));
      setEditValues(prev => ({ ...prev, stepsTarget: goals.steps.target }));
    } else if (type === 'weight') {
      setGoals(prev => ({
        ...prev,
        weight: { ...prev.weight, editing: true }
      }));
      setEditValues(prev => ({ ...prev, weightTarget: goals.weight.target }));
    } else if (type === 'workout') {
      setGoals(prev => ({
        ...prev,
        workout: { ...prev.workout, editing: true }
      }));
      setEditValues(prev => ({ 
        ...prev, 
        workoutType: goals.workout.type, 
        workoutDuration: goals.workout.duration 
      }));
    } else if (type === 'macros') {
      setGoals(prev => ({
        ...prev,
        macros: { ...prev.macros, editing: true }
      }));
      setEditValues(prev => ({
        ...prev,
        caloriesTarget: goals.macros.calories.target,
        carbsTarget: goals.macros.carbs.target,
        proteinTarget: goals.macros.protein.target,
        fibreTarget: goals.macros.fibre.target
      }));
    } else if (type === 'streak') {
      setGoals(prev => ({
        ...prev,
        streak: { ...prev.streak, editing: true }
      }));
    }
  };

  const handleSave = (type: string) => {
    setGoals(prev => {
      const updated = { ...prev };
      
      if (type === 'steps') {
        updated.steps = { 
          ...prev.steps, 
          target: editValues.stepsTarget,
          editing: false
        };
      } else if (type === 'weight') {
        updated.weight = { 
          ...prev.weight, 
          target: editValues.weightTarget,
          editing: false
        };
      } else if (type === 'workout') {
        updated.workout = {
          ...prev.workout,
          type: editValues.workoutType,
          duration: editValues.workoutDuration,
          editing: false
        };
      } else if (type === 'macros') {
        updated.macros = {
          ...prev.macros,
          calories: { ...prev.macros.calories, target: editValues.caloriesTarget },
          carbs: { ...prev.macros.carbs, target: editValues.carbsTarget },
          protein: { ...prev.macros.protein, target: editValues.proteinTarget },
          fibre: { ...prev.macros.fibre, target: editValues.fibreTarget },
          editing: false
        };
      }
      
      return updated;
    });
  };

  const handleCancel = (type: string) => {
    if (type === 'steps') {
      setGoals(prev => ({
        ...prev,
        steps: { ...prev.steps, editing: false }
      }));
    } else if (type === 'weight') {
      setGoals(prev => ({
        ...prev,
        weight: { ...prev.weight, editing: false }
      }));
    } else if (type === 'workout') {
      setGoals(prev => ({
        ...prev,
        workout: { ...prev.workout, editing: false }
      }));
    } else if (type === 'macros') {
      setGoals(prev => ({
        ...prev,
        macros: { ...prev.macros, editing: false }
      }));
    } else if (type === 'streak') {
      setGoals(prev => ({
        ...prev,
        streak: { ...prev.streak, editing: false }
      }));
    }
  };

  const updateProgress = (type: string, field: string, increment: boolean) => {
    setGoals(prev => {
      const updated = { ...prev };
      
      if (type === 'steps') {
        updated.steps = { ...prev.steps, current: Math.max(0, prev.steps.current + (increment ? 100 : -100)) };
      } else if (type === 'weight') {
        updated.weight = { ...prev.weight, current: Math.max(0, prev.weight.current + (increment ? 1 : -1)) };
      } else if (type === 'macros') {
        const change = field === 'calories' ? 50 : 5;
        
        // Fix the dynamic property access issue
        if (field === 'calories') {
          updated.macros = {
            ...prev.macros,
            calories: {
              ...prev.macros.calories,
              current: Math.max(0, prev.macros.calories.current + (increment ? change : -change))
            }
          };
        } else if (field === 'carbs') {
          updated.macros = {
            ...prev.macros,
            carbs: {
              ...prev.macros.carbs,
              current: Math.max(0, prev.macros.carbs.current + (increment ? change : -change))
            }
          };
        } else if (field === 'protein') {
          updated.macros = {
            ...prev.macros,
            protein: {
              ...prev.macros.protein,
              current: Math.max(0, prev.macros.protein.current + (increment ? change : -change))
            }
          };
        } else if (field === 'fibre') {
          updated.macros = {
            ...prev.macros,
            fibre: {
              ...prev.macros.fibre,
              current: Math.max(0, prev.macros.fibre.current + (increment ? change : -change))
            }
          };
        }
      } else if (type === 'streak') {
        updated.streak = { ...prev.streak, count: Math.max(0, prev.streak.count + (increment ? 1 : -1)) };
      }
      
      return updated;
    });
  };

  const stepsPercentage = Math.round((goals.steps.current / goals.steps.target) * 100);
  const weightPercentage = Math.round((goals.weight.current / goals.weight.target) * 100);

  return (
    <div className="min-h-screen bg-lightblue p-6">
      <Navbar />
      
      <div className="flex flex-wrap justify-center gap-6 mt-10">
        {/* Left Placeholder - Progress Summary */}
        <div className="bg-white w-[450px] h-[600px] rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-blue mb-6">Daily Progress</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-blue font-semibold">Steps Progress</span>
              <span className="text-orange-500 font-bold">{stepsPercentage}%</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-blue font-semibold">Weight Progress</span>
              <span className="text-orange-500 font-bold">{weightPercentage}%</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-blue font-semibold">Calories</span>
              <span className="text-orange-500 font-bold">
                {Math.round((goals.macros.calories.current / goals.macros.calories.target) * 100)}%
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-blue font-semibold">Workout Streak</span>
              <span className="text-orange-500 font-bold">{goals.streak.count} days</span>
            </div>
            
            <div className="mt-8 p-4 bg-green-50 rounded-lg text-center">
              <div className="text-green-600 font-bold text-lg">
                {stepsPercentage >= 100 ? "Steps Goal Achieved! 🎉" : 
                 weightPercentage >= 100 ? "Weight Goal Achieved! 💪" : 
                 "Keep pushing! You're doing great! 🔥"}
              </div>
            </div>
          </div>
        </div>

        {/* Right Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Steps */}
          <div className="bg-white p-4 rounded-2xl flex flex-col items-center shadow-lg">
            <div className="flex justify-between w-full mb-2">
              <h2 className="text-blue font-bold">Steps</h2>
              <button 
                onClick={() => handleEdit('steps')}
                className="text-blue-500 hover:text-blue"
              >
                <Edit3 size={16} />
              </button>
            </div>
            
            {goals.steps.editing ? (
              <div className="w-full space-y-2">
                <input
                  type="number"
                  value={editValues.stepsTarget || ''}
                  onChange={(e) => setEditValues(prev => ({ ...prev, stepsTarget: parseInt(e.target.value) || 0 }))}
                  placeholder="Target steps"
                  className="w-full p-2 border rounded"
                />
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleSave('steps')}
                    className="flex-1 bg-green-500 text-white p-1 rounded"
                  >
                    <Check size={16} />
                  </button>
                  <button 
                    onClick={() => handleCancel('steps')}
                    className="flex-1 bg-red-500 text-white p-1 rounded"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <ProgressCircle 
                  percentage={stepsPercentage} 
                  value={`${goals.steps.current}/${goals.steps.target}`} 
                />
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => updateProgress('steps', '', false)}
                    className="bg-red-500 text-white p-1 rounded"
                  >
                    <Minus size={16} />
                  </button>
                  <button 
                    onClick={() => updateProgress('steps', '', true)}
                    className="bg-green-500 text-white p-1 rounded"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Weight */}
          <div className="bg-white p-4 rounded-2xl flex flex-col items-center shadow-lg">
            <div className="flex justify-between w-full mb-2">
              <h2 className="text-blue font-bold">Weight</h2>
              <button 
                onClick={() => handleEdit('weight')}
                className="text-blue-500 hover:text-blue"
              >
                <Edit3 size={16} />
              </button>
            </div>
            
            {goals.weight.editing ? (
              <div className="w-full space-y-2">
                <input
                  type="number"
                  value={editValues.weightTarget || ''}
                  onChange={(e) => setEditValues(prev => ({ ...prev, weightTarget: parseInt(e.target.value) || 0 }))}
                  placeholder="Target weight"
                  className="w-full p-2 border rounded"
                />
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleSave('weight')}
                    className="flex-1 bg-green-500 text-white p-1 rounded"
                  >
                    <Check size={16} />
                  </button>
                  <button 
                    onClick={() => handleCancel('weight')}
                    className="flex-1 bg-red-500 text-white p-1 rounded"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <ProgressCircle 
                  percentage={weightPercentage} 
                  value={`${goals.weight.current}/${goals.weight.target}`} 
                />
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => updateProgress('weight', '', false)}
                    className="bg-red-500 text-white p-1 rounded"
                  >
                    <Minus size={16} />
                  </button>
                  <button 
                    onClick={() => updateProgress('weight', '', true)}
                    className="bg-green-500 text-white p-1 rounded"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Workout */}
          <div className="bg-white p-4 rounded-2xl flex flex-col items-center shadow-lg">
            <div className="flex justify-between w-full mb-2">
              <h2 className="text-blue font-bold">Workout</h2>
              <button 
                onClick={() => handleEdit('workout')}
                className="text-blue-500 hover:text-blue"
              >
                <Edit3 size={16} />
              </button>
            </div>
            
            {goals.workout.editing ? (
              <div className="w-full space-y-2">
                <input
                  type="text"
                  value={editValues.workoutType || ''}
                  onChange={(e) => setEditValues(prev => ({ ...prev, workoutType: e.target.value }))}
                  placeholder="Workout type"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  value={editValues.workoutDuration || ''}
                  onChange={(e) => setEditValues(prev => ({ ...prev, workoutDuration: parseInt(e.target.value) || 0 }))}
                  placeholder="Duration (mins)"
                  className="w-full p-2 border rounded"
                />
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleSave('workout')}
                    className="flex-1 bg-green-500 text-white p-1 rounded"
                  >
                    <Check size={16} />
                  </button>
                  <button 
                    onClick={() => handleCancel('workout')}
                    className="flex-1 bg-red-500 text-white p-1 rounded"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-3xl my-2">🏋️‍♀️</div>
                <div className="text-blue-800 font-semibold">{goals.workout.type}</div>
                <div className="text-orange-500 text-sm">{goals.workout.duration} mins</div>
              </>
            )}
          </div>

          {/* Macros */}
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <div className="flex justify-between mb-2">
              <h2 className="text-blue font-bold">Macros</h2>
              <button 
                onClick={() => handleEdit('macros')}
                className="text-blue-500 hover:text-blue"
              >
                <Edit3 size={16} />
              </button>
            </div>
            
            {goals.macros.editing ? (
              <div className="space-y-2">
                <input
                  type="number"
                  value={editValues.caloriesTarget || ''}
                  onChange={(e) => setEditValues(prev => ({ ...prev, caloriesTarget: parseInt(e.target.value) || 0 }))}
                  placeholder="Calories target"
                  className="w-full p-1 border rounded text-xs"
                />
                <input
                  type="number"
                  value={editValues.carbsTarget || ''}
                  onChange={(e) => setEditValues(prev => ({ ...prev, carbsTarget: parseInt(e.target.value) || 0 }))}
                  placeholder="Carbs target"
                  className="w-full p-1 border rounded text-xs"
                />
                <input
                  type="number"
                  value={editValues.proteinTarget || ''}
                  onChange={(e) => setEditValues(prev => ({ ...prev, proteinTarget: parseInt(e.target.value) || 0 }))}
                  placeholder="Protein target"
                  className="w-full p-1 border rounded text-xs"
                />
                <input
                  type="number"
                  value={editValues.fibreTarget || ''}
                  onChange={(e) => setEditValues(prev => ({ ...prev, fibreTarget: parseInt(e.target.value) || 0 }))}
                  placeholder="Fibre target"
                  className="w-full p-1 border rounded text-xs"
                />
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleSave('macros')}
                    className="flex-1 bg-green-500 text-white p-1 rounded"
                  >
                    <Check size={12} />
                  </button>
                  <button 
                    onClick={() => handleCancel('macros')}
                    className="flex-1 bg-red-500 text-white p-1 rounded"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <ProgressBar 
                        label="Calories" 
                        current={goals.macros.calories.current} 
                        total={goals.macros.calories.target} 
                      />
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button 
                        onClick={() => updateProgress('macros', 'calories', false)}
                        className="bg-red-500 text-white p-1 rounded"
                      >
                        <Minus size={12} />
                      </button>
                      <button 
                        onClick={() => updateProgress('macros', 'calories', true)}
                        className="bg-green-500 text-white p-1 rounded"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <ProgressBar 
                        label="Carbohydrates" 
                        current={goals.macros.carbs.current} 
                        total={goals.macros.carbs.target} 
                      />
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button 
                        onClick={() => updateProgress('macros', 'carbs', false)}
                        className="bg-red-500 text-white p-1 rounded"
                      >
                        <Minus size={12} />
                      </button>
                      <button 
                        onClick={() => updateProgress('macros', 'carbs', true)}
                        className="bg-green-500 text-white p-1 rounded"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <ProgressBar 
                        label="Protein" 
                        current={goals.macros.protein.current} 
                        total={goals.macros.protein.target} 
                      />
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button 
                        onClick={() => updateProgress('macros', 'protein', false)}
                        className="bg-red-500 text-white p-1 rounded"
                      >
                        <Minus size={12} />
                      </button>
                      <button 
                        onClick={() => updateProgress('macros', 'protein', true)}
                        className="bg-green-500 text-white p-1 rounded"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <ProgressBar 
                        label="Fibre" 
                        current={goals.macros.fibre.current} 
                        total={goals.macros.fibre.target} 
                      />
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button 
                        onClick={() => updateProgress('macros', 'fibre', false)}
                        className="bg-red-500 text-white p-1 rounded"
                      >
                        <Minus size={12} />
                      </button>
                      <button 
                        onClick={() => updateProgress('macros', 'fibre', true)}
                        className="bg-green-500 text-white p-1 rounded"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Workout Streak */}
          <div className="bg-white p-4 rounded-2xl col-span-2 text-center shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-blue font-bold">Workout Streak</h2>
              <button 
                onClick={() => handleEdit('streak')}
                className="text-blue-500 hover:text-blue"
              >
                <Edit3 size={16} />
              </button>
            </div>
            
            <div className="text-xl mt-2">{goals.streak.count}🔥</div>
            
            <div className="flex justify-center gap-2 mt-2">
              <button 
                onClick={() => updateProgress('streak', '', false)}
                className="bg-red-500 text-white p-2 rounded"
              >
                <Minus size={16} />
              </button>
              <button 
                onClick={() => updateProgress('streak', '', true)}
                className="bg-green-500 text-white p-2 rounded"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;