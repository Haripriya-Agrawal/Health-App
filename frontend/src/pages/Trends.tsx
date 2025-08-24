import React, { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { dailyLogService } from "../services/dailyLogService";
import { goalsService } from "../services/goalsService";

// ---------- Types ----------
type Log = {
  date: string; // YYYY-MM-DD
  weight?: { value: number; measuredAt?: string } | number;
  activity?: { type: string; steps?: number; duration?: number };
  macros?: { calories: number; carbs: number; protein: number; fat: number; fiber: number };
};

type Goals = {
  stepsTarget?: number;
  workoutType?: string;
  workoutDuration?: number;
  macros?: { calories?: number; carbs?: number; protein?: number; fat?: number; fiber?: number };
  streak?: number;
  currentWeight?: number;
  goalWeight?: number;
};

// ---------- Helpers ----------
const toNumber = (v: any): number => (typeof v === "number" ? v : Number(v) || 0);
const formatDateShort = (iso: string) => iso.slice(5).replace("-", "/"); // MM/DD

const movingAvg = (arr: number[], window = 7) => {
  const out: number[] = [];
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
    if (i >= window) sum -= arr[i - window];
    out.push(i >= window - 1 ? sum / window : NaN);
  }
  return out;
};

const normalize = (vals: number[]) => {
  const filtered = vals.filter((v) => !Number.isNaN(v));
  const min = Math.min(...filtered);
  const max = Math.max(...filtered);
  if (!Number.isFinite(min) || !Number.isFinite(max) || max === min) {
    return vals.map((v) => (Number.isNaN(v) ? NaN : 0.5));
  }
  return vals.map((v) => (Number.isNaN(v) ? NaN : (v - min) / (max - min)));
};

const avg = (arr: number[]) => {
  const vals = arr.filter((v) => Number.isFinite(v));
  if (!vals.length) return 0;
  return vals.reduce((s, v) => s + v, 0) / vals.length;
};

// ---------- Responsive measure hook ----------
const useMeasure = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number>(360);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new ResizeObserver((entries) => {
      for (const e of entries) {
        if (e.contentRect?.width) setWidth(e.contentRect.width);
      }
    });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, width };
};

// ---------- Tiny SVG Charts (no deps) ----------
const LineChart: React.FC<{
  data: number[];
  labels: string[];
  height?: number;
  color?: string;
  secondary?: number[]; // overlay (e.g., moving avg)
}> = ({ data, labels, height = 180, color = "#067BC2", secondary }) => {
  const { ref, width } = useMeasure();

  const norm = normalize(data);
  const sec = secondary ? normalize(secondary) : undefined;
  const w = Math.max(240, width); // responsive to container
  const h = height;
  const pad = 16;

  const toPath = (vals: number[], stroke: string, dash = "") => {
    const pts = vals
      .map((v, i) => {
        if (Number.isNaN(v)) return null;
        const x =
          vals.length === 1
            ? pad + (w - 2 * pad) / 2
            : pad + (i * (w - 2 * pad)) / Math.max(1, vals.length - 1);
        const y = pad + (1 - v) * (h - 2 * pad);
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .filter(Boolean)
      .join(" ");
    return <path d={pts} fill="none" stroke={stroke} strokeWidth="2" strokeDasharray={dash} />;
  };

  return (
    <div ref={ref} className="w-full">
      <svg width={w} height={h} className="bg-white rounded-xl border border-[#B1D5E5]">
        {/* grid */}
        {[0.25, 0.5, 0.75].map((g, idx) => {
          const y = pad + (1 - g) * (h - 2 * pad);
          return <line key={idx} x1={pad} x2={w - pad} y1={y} y2={y} stroke="#E6F2F8" />;
        })}
        {toPath(norm, color)}
        {sec && toPath(sec, "#F37748", "4 4")}
      </svg>
      <div className="flex justify-between text-[10px] md:text-xs text-blue-700 mt-1 px-1">
        <span>{labels[0]}</span>
        <span>{labels[labels.length - 1]}</span>
      </div>
    </div>
  );
};

const BarChart: React.FC<{
  data: number[];
  labels: string[];
  goal?: number;
  height?: number;
  barColor?: string;
}> = ({ data, labels, goal, height = 180, barColor = "#84BCDA" }) => {
  const { ref, width } = useMeasure();
  const w = Math.max(240, width);
  const h = height;
  const pad = 16;
  const maxVal = Math.max(...data, goal || 0, 1);

  const gap = 6;
  const barW = Math.max(8, (w - 2 * pad - gap * (data.length - 1)) / Math.max(1, data.length));
  let x = pad;

  return (
    <div ref={ref} className="w-full">
      <svg width={w} height={h} className="bg-white rounded-xl border border-[#B1D5E5]">
        {[0.25, 0.5, 0.75].map((g, idx) => {
          const y = pad + (1 - g) * (h - 2 * pad);
          return <line key={idx} x1={pad} x2={w - pad} y1={y} y2={y} stroke="#E6F2F8" />;
        })}

        {data.map((v, i) => {
          const bh = ((v / maxVal) * (h - 2 * pad)) | 0;
          const y = h - pad - bh;
          const rect = <rect key={i} x={x} y={y} width={barW} height={bh} rx="4" fill={barColor} />;
          x += barW + gap;
          return rect;
        })}

        {goal != null && (
          <line
            x1={pad}
            x2={w - pad}
            y1={pad + (1 - goal / maxVal) * (h - 2 * pad)}
            y2={pad + (1 - goal / maxVal) * (h - 2 * pad)}
            stroke="#F37748"
            strokeDasharray="6 4"
          />
        )}
      </svg>
      <div className="flex justify-between text-[10px] md:text-xs text-blue-700 mt-1 px-1">
        <span>{labels[0]}</span>
        <span>{labels[labels.length - 1]}</span>
      </div>
    </div>
  );
};

const Donut: React.FC<{ parts: { label: string; value: number }[] }> = ({ parts }) => {
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  const r = 52;
  const c = 2 * Math.PI * r;
  let acc = 0;

  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto">
      <g transform="translate(70,70)">
        <circle r={r} cx="0" cy="0" fill="none" stroke="#EAF5FA" strokeWidth="16" />
        {parts.map((p, i) => {
          const frac = p.value / total;
          const len = frac * c;
          const dash = `${len} ${c - len}`;
          const rot = (acc / total) * 360;
          acc += p.value;
          const color = ["#067BC2", "#F37748", "#ECC30B", "#84BCDA", "#4F46E5"][i % 5];
          return (
            <circle
              key={i}
              r={r}
              cx="0"
              cy="0"
              fill="none"
              stroke={color}
              strokeWidth="16"
              strokeDasharray={dash}
              transform={`rotate(${rot - 90})`}
              strokeLinecap="butt"
            />
          );
        })}
      </g>
    </svg>
  );
};

// ---------- Main ----------
const Trends: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [goals, setGoals] = useState<Goals | null>(null);
  const [loading, setLoading] = useState(true);

  // toggle for "All macros vs goals"
  const [macroMetric, setMacroMetric] = useState<"calories" | "protein" | "carbs" | "fat" | "fiber">("calories");

  useEffect(() => {
    (async () => {
      try {
        const [l, g] = await Promise.all([dailyLogService.getLogs(), goalsService.getGoals()]);
        setLogs(Array.isArray(l) ? l : []);
        setGoals(g || null);
      } catch (e) {
        console.error("Trends load error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const series = useMemo(() => {
    const byDate = [...logs].sort((a, b) => a.date.localeCompare(b.date));
    const dates = byDate.map((d) => formatDateShort(d.date));

    const weights = byDate.map((d) =>
      typeof d.weight === "number" ? d.weight : d.weight?.value ?? NaN
    );
    const duration = byDate.map((d) => toNumber(d.activity?.duration));
    const calories = byDate.map((d) => toNumber(d.macros?.calories));
    const protein = byDate.map((d) => toNumber(d.macros?.protein));
    const carbs = byDate.map((d) => toNumber(d.macros?.carbs));
    const fat = byDate.map((d) => toNumber(d.macros?.fat));
    const fiber = byDate.map((d) => toNumber(d.macros?.fiber));

    const weightMA7 = movingAvg(weights, 7);

    // donut split from averages (grams -> kcal)
    const avgProtein = avg(protein);
    const avgCarbs = avg(carbs);
    const avgFat = avg(fat);
    const kcalSplit = [
      { label: "Protein", value: avgProtein * 4 },
      { label: "Carbs", value: avgCarbs * 4 },
      { label: "Fat", value: avgFat * 9 },
    ];

    return {
      dates,
      weights,
      weightMA7,
      duration,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      kcalSplit,
    };
  }, [logs]);

  const macroGoalValue = goals?.macros?.[macroMetric] ?? undefined;
  const macroData =
    macroMetric === "calories"
      ? series.calories
      : macroMetric === "protein"
      ? series.protein
      : macroMetric === "carbs"
      ? series.carbs
      : macroMetric === "fat"
      ? series.fat
      : series.fiber;

  if (loading) {
    return (
      <div className="min-h-screen bg-lightblue p-6">
        <Navbar />
        <div className="max-w-4xl mx-auto mt-10 bg-white rounded-2xl p-6 relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse rounded-t-2xl" />
          <p className="text-blue-700">Loading trends…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lightblue p-4 md:p-6">
      <Navbar />

      <div className="max-w-7xl mx-auto mt-6 md:mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* (1) Weight Trend with 7d MA */}
        <div className="bg-[#FEEFEF] rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[#007BFF] font-semibold text-base md:text-lg">Weight Trend</h2>
            <span className="text-[10px] md:text-xs text-blue-500">7‑day moving avg</span>
          </div>
          <LineChart data={series.weights} labels={series.dates} secondary={series.weightMA7} />
        </div>

        {/* (2) Macros Split Donut */}
        <div className="bg-[#FEEFEF] rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[#007BFF] font-semibold text-base md:text-lg">Average Daily Macro Energy Split</h2>
            <span className="text-[10px] md:text-xs text-blue-500">Protein / Carbs / Fat → kcal</span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Donut parts={series.kcalSplit} />
            <div className="grid grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm w-full">
              {series.kcalSplit.map((p, i) => (
                <div key={i} className="bg-white border border-[#B1D5E5] rounded-xl px-3 md:px-4 py-2 md:py-3 text-center">
                  <div className="font-semibold">{p.label}</div>
                  <div className="text-blue-700">{Math.round(p.value)} kcal/day</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* (3) All Macros vs Goals — single chart with toggles */}
        <div className="bg-[#FEEFEF] rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[#007BFF] font-semibold text-base md:text-lg">Macros vs Goals</h2>
            <div className="flex gap-2 overflow-x-auto no-scrollbar px-1">
              {(["calories", "protein", "carbs", "fat", "fiber"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMacroMetric(m)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    macroMetric === m
                      ? "bg-gradient-to-r from-[#B1D5E5] to-[#F48C74] text-white shadow"
                      : "bg-white border border-[#B1D5E5] text-blue-700"
                  }`}
                >
                  {m[0].toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="text-[11px] md:text-xs text-blue-500 mb-2">
            Goal:{" "}
            {macroGoalValue != null
              ? `${macroMetric === "calories" ? macroGoalValue + " kcal" : macroGoalValue + " g"}`
              : "—"}
          </div>
          <BarChart
            data={macroData}
            labels={series.dates}
            goal={macroGoalValue}
            barColor={
              macroMetric === "protein"
                ? "#F48C74"
                : macroMetric === "carbs"
                ? "#84BCDA"
                : macroMetric === "fat"
                ? "#ECC30B"
                : macroMetric === "fiber"
                ? "#4F46E5"
                : "#84BCDA"
            }
          />
        </div>

        {/* (4) Activity Minutes */}
        <div className="bg-[#FEEFEF] rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[#007BFF] font-semibold text-base md:text-lg">Activity Minutes</h2>
            <span className="text-[10px] md:text-xs text-blue-500">Daily duration (min)</span>
          </div>
          <LineChart data={series.duration} labels={series.dates} color="#4F46E5" />
        </div>
      </div>
    </div>
  );
};

export default Trends;
