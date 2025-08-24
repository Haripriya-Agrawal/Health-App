import { useState, useEffect } from "react";
import { Edit3, Plus, Minus, Check, X } from "lucide-react";
import Navbar from "../components/Navbar";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

const ProgressCircle = ({
  percentage,
  value,
}: {
  percentage: number;
  value: string;
}) => (
  <div className="relative w-24 h-24 rounded-full border-[6px] border-orange-400 flex items-center justify-center">
    <div className="text-center text-blue font-bold">
      <div>{percentage}%</div>
      <div className="text-xs text-blue-500">{value}</div>
    </div>
  </div>
);

const ProgressBar = ({
  label,
  current,
  total,
}: {
  label: string;
  current: number;
  total: number;
}) => (
  <div className="mb-2">
    <div className="flex justify-between text-xs text-blue font-semibold">
      <span>{label}</span>
      <span>
        {current}
        {label === "Calories"
          ? "kcal"
          : label === "Fibre"
          ? "g"
          : "g"}/{total}
        {label === "Calories"
          ? "kcal"
          : label === "Fibre"
          ? "g"
          : "g"}
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
  const [goals, setGoals] = useState<any>(null);
  const [editValues, setEditValues] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // ✅ Fetch goals
        const res = await fetch(`${API_BASE_URL}/goals`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const goalsData = await res.json();

        // ✅ Fetch latest daily log (for currentWeight)
        const logRes = await fetch(`${API_BASE_URL}/daily-log?latest=true`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const logData = await logRes.json();

        setGoals({
          steps: {
            current: logData?.activity?.steps || 0,
            target: goalsData.stepsTarget || 10000,
            editing: false,
          },
          weight: {
            current: logData?.weight || goalsData.currentWeight || 0,
            target: goalsData.goalWeight || 0,
            editing: false,
          },
          workout: {
            type: goalsData.workoutType || "Leg Day",
            duration: goalsData.workoutDuration || 45,
            editing: false,
          },
          macros: {
            calories: {
              current: logData?.macros?.calories || 0,
              target: goalsData.macros?.calories || 2000,
            },
            carbs: {
              current: logData?.macros?.carbs || 0,
              target: goalsData.macros?.carbs || 250,
            },
            protein: {
              current: logData?.macros?.protein || 0,
              target: goalsData.macros?.protein || 120,
            },
            fibre: {
              current: logData?.macros?.fiber || 0,
              target: goalsData.macros?.fiber || 30,
            },
            editing: false,
          },
          streak: {
            count: goalsData.streak || 0,
            editing: false,
          },
        });
      } catch (err) {
        console.error("❌ Error fetching goals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (type: string) => {
    if (!goals) return;
    setGoals((prev: any) => ({
      ...prev,
      [type]: { ...prev[type], editing: true },
    }));

    if (type === "steps")
      setEditValues((prev: any) => ({ ...prev, stepsTarget: goals.steps.target }));
    if (type === "weight")
      setEditValues((prev: any) => ({
        ...prev,
        weightTarget: goals.weight.target,
      }));
    if (type === "workout")
      setEditValues((prev: any) => ({
        ...prev,
        workoutType: goals.workout.type,
        workoutDuration: goals.workout.duration,
      }));
    if (type === "macros")
      setEditValues((prev: any) => ({
        ...prev,
        caloriesTarget: goals.macros.calories.target,
        carbsTarget: goals.macros.carbs.target,
        proteinTarget: goals.macros.protein.target,
        fibreTarget: goals.macros.fibre.target,
      }));
  };

  const handleSave = async (type: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/goals`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editValues),
      });

      setGoals((prev: any) => {
        const updated = { ...prev };

        if (type === "steps") {
          updated.steps = {
            ...prev.steps,
            target: editValues.stepsTarget,
            editing: false,
          };
        } else if (type === "weight") {
          updated.weight = {
            ...prev.weight,
            target: editValues.weightTarget,
            editing: false,
          };
        } else if (type === "workout") {
          updated.workout = {
            ...prev.workout,
            type: editValues.workoutType,
            duration: editValues.workoutDuration,
            editing: false,
          };
        } else if (type === "macros") {
          updated.macros = {
            ...prev.macros,
            calories: {
              ...prev.macros.calories,
              target: editValues.caloriesTarget,
            },
            carbs: { ...prev.macros.carbs, target: editValues.carbsTarget },
            protein: { ...prev.macros.protein, target: editValues.proteinTarget },
            fibre: { ...prev.macros.fibre, target: editValues.fibreTarget },
            editing: false,
          };
        }
        return updated;
      });
    } catch (err) {
      console.error("❌ Error saving goals:", err);
    }
  };

  const handleCancel = (type: string) => {
    setGoals((prev: any) => ({
      ...prev,
      [type]: { ...prev[type], editing: false },
    }));
  };

  const updateProgress = (type: string, field: string, increment: boolean) => {
    setGoals((prev: any) => {
      const updated = { ...prev };

      if (type === "steps") {
        updated.steps = {
          ...prev.steps,
          current: Math.max(
            0,
            prev.steps.current + (increment ? 100 : -100)
          ),
        };
      } else if (type === "weight") {
        updated.weight = {
          ...prev.weight,
          current: Math.max(
            0,
            prev.weight.current + (increment ? 1 : -1)
          ),
        };
      } else if (type === "macros") {
        const change = field === "calories" ? 50 : 5;

        if (field === "calories") {
          updated.macros = {
            ...prev.macros,
            calories: {
              ...prev.macros.calories,
              current: Math.max(
                0,
                prev.macros.calories.current + (increment ? change : -change)
              ),
            },
          };
        } else if (field === "carbs") {
          updated.macros = {
            ...prev.macros,
            carbs: {
              ...prev.macros.carbs,
              current: Math.max(
                0,
                prev.macros.carbs.current + (increment ? change : -change)
              ),
            },
          };
        } else if (field === "protein") {
          updated.macros = {
            ...prev.macros,
            protein: {
              ...prev.macros.protein,
              current: Math.max(
                0,
                prev.macros.protein.current + (increment ? change : -change)
              ),
            },
          };
        } else if (field === "fibre") {
          updated.macros = {
            ...prev.macros,
            fibre: {
              ...prev.macros.fibre,
              current: Math.max(
                0,
                prev.macros.fibre.current + (increment ? change : -change)
              ),
            },
          };
        }
      } else if (type === "streak") {
        updated.streak = {
          ...prev.streak,
          count: Math.max(
            0,
            prev.streak.count + (increment ? 1 : -1)
          ),
        };
      }

      return updated;
    });
  };

  if (loading || !goals) return <div className="p-6">Loading...</div>;

  const stepsPercentage = Math.round(
    (goals.steps.current / goals.steps.target) * 100
  );
  const weightPercentage = Math.round(
    (goals.weight.current / goals.weight.target) * 100
  );

  return (
    <div className="min-h-screen bg-lightblue p-6">
      <Navbar />
      {/* rest of your JSX stays the same... */}
    </div>
  );
};

export default Goals;
