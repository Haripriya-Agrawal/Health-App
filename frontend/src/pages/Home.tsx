import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import day from "../assets/day.svg";
import evening from "../assets/evening.svg";
import night from "../assets/night.svg";
import { dailyLogService } from "../services/dailyLogService";

type Macros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

const getToday = () => new Date().toISOString().slice(0, 10);
const SUBMIT_STATE_KEY = "healthapp_submit_state_date";

const Home: React.FC = () => {
  // ✅ Weight logging
  const [weight, setWeight] = useState("");
  const [measuredAt, setMeasuredAt] = useState("");

  // ✅ Activity logging
  const [activityType, setActivityType] = useState("");
  const [steps, setSteps] = useState("");
  const [duration, setDuration] = useState("");

  // ✅ Meals + Macros
  const [meals, setMeals] = useState({
    breakfast: "",
    lunch: "",
    snacks: "",
    dinner: "",
  });
  const [macros, setMacros] = useState<Macros>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
  });

  // ✅ Local loading states
  const [loadingWeight, setLoadingWeight] = useState(false);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [loadingMacros, setLoadingMacros] = useState(false);

  // ✅ “Logged today” flags (UI badges only)
  const [weightLogged, setWeightLogged] = useState<null | { value: number; measuredAt: string }>(null);
  const [activityLogged, setActivityLogged] = useState<null | { type: string; steps?: number; duration?: number }>(null);
  const [mealsLogged, setMealsLogged] = useState<boolean>(false);

  // ---- Bootstrap: reset flags if date changed, and pull today's log if present ----
  useEffect(() => {
    const today = getToday();
    const storedDate = localStorage.getItem(SUBMIT_STATE_KEY);

    // If day changed, clear local flags
    if (storedDate !== today) {
      localStorage.setItem(SUBMIT_STATE_KEY, today);
      localStorage.removeItem("weightLogged");
      localStorage.removeItem("activityLogged");
      localStorage.removeItem("mealsLogged");
    } else {
      // restore badges
      const w = localStorage.getItem("weightLogged");
      const a = localStorage.getItem("activityLogged");
      const m = localStorage.getItem("mealsLogged");
      if (w) setWeightLogged(JSON.parse(w));
      if (a) setActivityLogged(JSON.parse(a));
      if (m) setMealsLogged(m === "true");
    }

    // Pull today's log from backend to PREFILL inputs & set badges
    (async () => {
      try {
        const logs = await dailyLogService.getLogs();
        const todayLog = (logs || []).find((l: any) => l.date === today);
        if (todayLog) {
          if (todayLog.weight && typeof todayLog.weight === "object") {
            const saved = { value: todayLog.weight.value, measuredAt: todayLog.weight.measuredAt };
            setWeightLogged(saved);
            localStorage.setItem("weightLogged", JSON.stringify(saved));
            setWeight(String(todayLog.weight.value ?? ""));
            setMeasuredAt(todayLog.weight.measuredAt ?? "");
          }
          if (todayLog.activity && todayLog.activity.type) {
            const saved = {
              type: todayLog.activity.type,
              steps: todayLog.activity.steps || 0,
              duration: todayLog.activity.duration || 0,
            };
            setActivityLogged(saved);
            localStorage.setItem("activityLogged", JSON.stringify(saved));
            setActivityType(saved.type);
            setSteps(String(saved.steps || ""));
            setDuration(String(saved.duration || ""));
          }
          if (todayLog.meals) {
            setMeals({
              breakfast: todayLog.meals.breakfast || "",
              lunch: todayLog.meals.lunch || "",
              snacks: todayLog.meals.snacks || "",
              dinner: todayLog.meals.dinner || "",
            });
          }
          if (todayLog.macros) {
            setMacros({
              calories: todayLog.macros.calories || 0,
              carbs: todayLog.macros.carbs || 0,
              protein: todayLog.macros.protein || 0,
              fat: todayLog.macros.fat || 0,
              fiber: todayLog.macros.fiber || 0,
            });
            setMealsLogged(true);
            localStorage.setItem("mealsLogged", "true");
          }
        } else {
          // no log for today -> clear prefilled inputs
          setWeight("");
          setMeasuredAt("");
          setActivityType("");
          setSteps("");
          setDuration("");
          setMeals({ breakfast: "", lunch: "", snacks: "", dinner: "" });
          setMacros({ calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
          setWeightLogged(null);
          setActivityLogged(null);
          setMealsLogged(false);
        }
      } catch (err) {
        console.error("Error loading today's log:", err);
      }
    })();
  }, []);

  // ---------------- Weight Logging ----------------
  const logWeight = async () => {
    if (!measuredAt) {
      console.error("Please choose when you measured (morning/evening/night).");
      return;
    }
    try {
      setLoadingWeight(true);
      const res = await dailyLogService.logWeight({
        weight: Number(weight),
        measuredAt,
      });
      const val =
        res?.weight?.value ??
        (typeof res?.weight === "object" ? res?.weight?.value : Number(weight));
      const when =
        res?.weight?.measuredAt ??
        (typeof res?.weight === "object" ? res?.weight?.measuredAt : measuredAt);
      const saved = { value: val, measuredAt: when };
      setWeightLogged(saved);
      localStorage.setItem("weightLogged", JSON.stringify(saved));
    } catch (err) {
      console.error("Error logging weight:", err);
    } finally {
      setLoadingWeight(false);
    }
  };

  // ---------------- Activity Logging ----------------
  const logActivity = async () => {
    try {
      setLoadingActivity(true);
      await dailyLogService.logActivity({
        type: activityType,
        steps: Number(steps),
        duration: Number(duration),
      });
      const saved = {
        type: activityType,
        steps: Number(steps) || 0,
        duration: Number(duration) || 0,
      };
      setActivityLogged(saved);
      localStorage.setItem("activityLogged", JSON.stringify(saved));
    } catch (err) {
      console.error("Error logging activity:", err);
    } finally {
      setLoadingActivity(false);
    }
  };

  // ---------------- Macro Calculation ----------------
  const calculateMacros = async () => {
    try {
      setLoadingMacros(true);
      const preparedMeals: Record<string, string> = {};
      (Object.keys(meals) as Array<keyof typeof meals>).forEach((k) => {
        const val = meals[k];
        if (typeof val === "string" && val.trim().length > 0) {
          preparedMeals[k] = val.trim();
        }
      });

      const data = await dailyLogService.calculateMacros(preparedMeals);
      if (data?.macros) {
        setMacros({
          calories: data.macros.calories || 0,
          carbs: data.macros.carbs || 0,
          protein: data.macros.protein || 0,
          fat: data.macros.fat || 0,
          fiber: data.macros.fiber || 0,
        });
        setMealsLogged(true);
        localStorage.setItem("mealsLogged", "true");
      }
    } catch (err) {
      console.error("Error calculating macros:", err);
    } finally {
      setLoadingMacros(false);
    }
  };

  const LoggedBadge = ({ text }: { text: string }) => (
    <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100/80 text-green-800 border border-white/60">
      <span aria-hidden>✓</span> {text}
    </span>
  );

  return (
  <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#FDE68A] via-[#FBCFE8] to-[#DDD6FE]">
    {/* Luxe pastel aura background */}
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div
        className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-60"
        style={{ background: "radial-gradient( circle at 30% 30%, #FDE68A 0%, transparent 60% )" }}
      />
      <div
        className="absolute top-10 right-0 h-96 w-96 rounded-full blur-3xl opacity-60"
        style={{ background: "radial-gradient( circle at 70% 30%, #DDD6FE 0%, transparent 60% )" }}
      />
      <div
        className="absolute bottom-[-120px] left-1/2 -translate-x-1/2 h-[420px] w-[420px] rounded-full blur-3xl opacity-50"
        style={{ background: "radial-gradient( circle at 50% 50%, #F5D0FE 0%, transparent 60% )" }}
      />
    </div>

    <div className="bg-transparent text-darkblue p-6">
      <Navbar />

      <div className="max-w-4xl mx-auto mt-10">
        {/* Grid: keep same sizing (two columns on md+) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Weight Card */}
          <div className="group [perspective:1200px]">
            <div
              className="relative h-full flex flex-col rounded-[28px] p-6 bg-white/25 backdrop-blur-xl border border-white/60
                         shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                         transform-gpu transition-all duration-300
                         group-hover:-translate-y-2 group-hover:scale-[1.015]
                         group-hover:shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
            >
              {loadingWeight && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FDE68A] via-[#FBCFE8] to-[#DDD6FE] animate-pulse rounded-t-[28px]" />
              )}
              <h2 className="text-center font-semibold text-[#6B21A8] text-lg mb-6">
                Today&apos;s Weight
                {weightLogged && (
                  <LoggedBadge text={`Logged: ${weightLogged.value}kg (${weightLogged.measuredAt})`} />
                )}
              </h2>

              <div className="space-y-4">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-white/50 border border-white/70 placeholder-[#6B7280] text-center focus:outline-none focus:ring-2 focus:ring-[#FDE68A]"
                  placeholder="Enter weight"
                />

                <div>
                  <label className="block text-[#6B21A8] mb-2 text-center mt-2">Measured When?</label>
                  <div className="flex justify-center gap-6">
                    <button
                      onClick={() => setMeasuredAt("morning")}
                      className={`rounded-xl p-1 hover:scale-[1.03] transition ${
                        measuredAt === "morning" ? "ring-2 ring-[#FDE68A]" : ""
                      }`}
                    >
                      <img src={day} alt="Morning" />
                    </button>
                    <button
                      onClick={() => setMeasuredAt("evening")}
                      className={`rounded-xl p-1 hover:scale-[1.03] transition ${
                        measuredAt === "evening" ? "ring-2 ring-[#FDE68A]" : ""
                      }`}
                    >
                      <img src={evening} alt="Evening" />
                    </button>
                    <button
                      onClick={() => setMeasuredAt("night")}
                      className={`rounded-xl p-1 hover:scale-[1.03] transition ${
                        measuredAt === "night" ? "ring-2 ring-[#FDE68A]" : ""
                      }`}
                    >
                      <img src={night} alt="Night" />
                    </button>
                  </div>
                </div>

                {/* Button with higher-contrast label */}
                <button
                  onClick={logWeight}
                  className="relative w-full py-2.5 rounded-2xl font-semibold
                             bg-gradient-to-r from-[#FDE68A] via-[#FBCFE8] to-[#DDD6FE]
                             ring-1 ring-white/60 shadow-md
                             hover:shadow-xl hover:brightness-[1.08] active:brightness-95
                             transition"
                >
                  <span className="text-[#3B0764] drop-shadow-[0_1px_0_rgba(255,255,255,0.7)]">
                    {loadingWeight ? "Logging..." : "Log Weight"}
                  </span>
                  <span className="pointer-events-none absolute inset-0 rounded-2xl bg-white/10" />
                </button>
              </div>
            </div>
          </div>

          {/* Activity Card */}
          <div className="group [perspective:1200px]">
            <div
              className="relative h-full flex flex-col rounded-[28px] p-6 bg-white/25 backdrop-blur-xl border border-white/60
                         shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                         transform-gpu transition-all duration-300
                         group-hover:-translate-y-2 group-hover:scale-[1.015]
                         group-hover:shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
            >
              {loadingActivity && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#DDD6FE] via-[#FBCFE8] to-[#FDE68A] animate-pulse rounded-t-[28px]" />
              )}
              <h2 className="text-center font-semibold text-[#6B21A8] text-lg mb-6">
                Activity
                {activityLogged && (
                  <LoggedBadge
                    text={`Logged: ${activityLogged.type} (${activityLogged.steps || 0} steps, ${
                      activityLogged.duration || 0
                    } min)`}
                  />
                )}
              </h2>

              <div className="space-y-3">
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-white/50 border border-white/70 text-center focus:outline-none focus:ring-2 focus:ring-[#DDD6FE]"
                >
                  <option value="">Select Activity</option>
                  <option value="walking">Walking</option>
                  <option value="running">Running</option>
                  <option value="cycling">Cycling</option>
                  <option value="gym">Gym</option>
                </select>

                <input
                  type="number"
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  placeholder="Steps"
                  className="w-full p-3 rounded-2xl bg-white/50 border border-white/70 text-center focus:outline-none focus:ring-2 focus:ring-[#DDD6FE]"
                />

                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Duration (minutes)"
                  className="w-full p-3 rounded-2xl bg-white/50 border border-white/70 text-center focus:outline-none focus:ring-2 focus:ring-[#DDD6FE]"
                />

                <button
                  onClick={logActivity}
                  className="relative w-full py-2.5 rounded-2xl font-semibold
                             bg-gradient-to-r from-[#DDD6FE] via-[#FBCFE8] to-[#FDE68A]
                             ring-1 ring-white/60 shadow-md
                             hover:shadow-xl hover:brightness-[1.08] active:brightness-95
                             transition"
                >
                  <span className="text-[#3B0764] drop-shadow-[0_1px_0_rgba(255,255,255,0.7)]">
                    {loadingActivity ? "Logging..." : "Log Activity"}
                  </span>
                  <span className="pointer-events-none absolute inset-0 rounded-2xl bg-white/10" />
                </button>
              </div>
            </div>
          </div>

          {/* Meals Card */}
          <div className="group [perspective:1200px]">
            <div
              className="h-full flex flex-col rounded-[28px] p-6 bg-white/25 backdrop-blur-xl border border-white/60
                         shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                         transform-gpu transition-all duration-300
                         group-hover:-translate-y-2 group-hover:scale-[1.015]
                         group-hover:shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
            >
              <h2 className="text-center font-semibold text-[#6B21A8] text-lg mb-5">
                Meals
                {mealsLogged && <LoggedBadge text="Logged for today" />}
              </h2>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {Object.keys(meals).map((mealKey) => (
                  <div key={mealKey} className="relative">
                    <input
                      type="text"
                      value={(meals as any)[mealKey]}
                      onChange={(e) => setMeals({ ...meals, [mealKey]: e.target.value })}
                      className="w-full bg-white/50 border border-white/70 text-[#1F2937] py-2.5 px-4 rounded-2xl
                                 focus:outline-none focus:ring-2 focus:ring-[#FBCFE8] text-center placeholder-[#9CA3AF]"
                      placeholder={`Enter ${mealKey}`}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={calculateMacros}
                className="relative w-full py-2.5 rounded-2xl font-semibold
                           bg-gradient-to-r from-[#FBCFE8] via-[#FDE68A] to-[#DDD6FE]
                           ring-1 ring-white/60 shadow-md
                           hover:shadow-xl hover:brightness-[1.08] active:brightness-95
                           transition"
              >
                <span className="text-[#3B0764] drop-shadow-[0_1px_0_rgba(255,255,255,0.7)]">
                  {loadingMacros ? "Calculating..." : "Calculate Macros"}
                </span>
                <span className="pointer-events-none absolute inset-0 rounded-2xl bg-white/10" />
              </button>
            </div>
          </div>

          {/* Macros Card */}
          <div className="group [perspective:1200px]">
            <div
              className="relative h-full flex flex-col rounded-[28px] p-6 bg-white/25 backdrop-blur-xl border border-white/60
                         shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                         transform-gpu transition-all duration-300
                         group-hover:-translate-y-2 group-hover:scale-[1.015]
                         group-hover:shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
            >
              {loadingMacros && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FBCFE8] via-[#FDE68A] to-[#DDD6FE] animate-pulse rounded-t-[28px]" />
              )}
              <h2 className="text-center font-semibold text-[#6B21A8] text-lg mb-4">Macros</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-[#1F2937]">
                  <tbody className="divide-y divide-white/60">
                    <tr>
                      <td className="py-2">
                        Calories: <span className="font-medium">{macros.calories}</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">
                        Protein: <span className="font-medium">{macros.protein} g</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">
                        Carbs: <span className="font-medium">{macros.carbs} g</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">
                        Fat: <span className="font-medium">{macros.fat} g</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">
                        Fiber: <span className="font-medium">{macros.fiber} g</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
);
};

export default Home;