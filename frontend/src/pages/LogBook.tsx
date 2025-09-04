import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { dailyLogService } from "../services/dailyLogService";

type WeightShape =
  | number
  | {
      value: number;
      measuredAt?: "morning" | "evening" | "night" | string;
    };

interface DailyLog {
  date: string;
  weight?: WeightShape;
  activity?: {
    type: string;
    steps?: number;
    duration?: number;
  };
  macros?: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    fiber: number;
  };
}

const renderWeight = (w?: WeightShape) => {
  if (w == null) return "-";
  if (typeof w === "number") return `${w}kg`;
  if (typeof w === "object" && typeof w.value === "number") {
    return `${w.value}kg${w.measuredAt ? ` (${w.measuredAt})` : ""}`;
  }
  return "-";
};

const LogBook: React.FC = () => {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await dailyLogService.getLogs();
        setLogs(data || []);
      } catch (err) {
        console.error("❌ Error fetching logs:", err);
      }
    };
    fetchLogs();
  }, []);

  // ---------- CSV EXPORT ----------
  const toPlainWeight = (w?: WeightShape) => {
    if (w == null) return { weight: "", measuredAt: "" };
    if (typeof w === "number") return { weight: String(w), measuredAt: "" };
    return { weight: String(w.value ?? ""), measuredAt: String(w.measuredAt ?? "") };
  };

  const escapeCsv = (val: any) => {
    const s = val == null ? "" : String(val);
    // Quote if contains comma, quote, or newline
    if (/[",\n]/.test(s)) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const downloadCsv = (rows: string[][], filename: string) => {
    const csv = rows.map(r => r.map(escapeCsv).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = async () => {
    try {
      setExporting(true);

      const headers = [
        "Date",
        "Weight (kg)",
        "Measured At",
        "Activity Type",
        "Steps",
        "Duration (min)",
        "Calories (kcal)",
        "Carbs (g)",
        "Protein (g)",
        "Fat (g)",
        "Fiber (g)",
      ];

      const rows: string[][] = [headers];

      (logs || []).forEach((entry) => {
        const { weight, measuredAt } = toPlainWeight(entry.weight);
        rows.push([
          entry.date || "",
          weight,
          measuredAt,
          entry.activity?.type || "",
          entry.activity?.steps != null ? String(entry.activity.steps) : "",
          entry.activity?.duration != null ? String(entry.activity.duration) : "",
          entry.macros?.calories != null ? String(entry.macros.calories) : "",
          entry.macros?.carbs != null ? String(entry.macros.carbs) : "",
          entry.macros?.protein != null ? String(entry.macros.protein) : "",
          entry.macros?.fat != null ? String(entry.macros.fat) : "",
          entry.macros?.fiber != null ? String(entry.macros.fiber) : "",
        ]);
      });

      const today = new Date().toISOString().slice(0, 10);
      downloadCsv(rows, `logbook_${today}.csv`);
    } catch (e) {
      console.error("CSV export failed:", e);
    } finally {
      setExporting(false);
    }
  };
  // --------------------------------

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#FDE68A] via-[#FBCFE8] to-[#DDD6FE]">
      {/* Luxe pastel aura background (same vibe as Home) */}
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

      <div className="bg-transparent p-6">
        <Navbar />

        <div className="max-w-6xl mx-auto mt-10">
          <div className="rounded-[28px] p-4 md:p-5 bg-white/20 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            <div className="overflow-x-auto">
              <table className="w-full text-center border-separate border-spacing-y-2 text-sm md:text-base">
                <thead>
                  <tr className="text-[#3B0764] font-semibold">
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Weight</th>
                    <th className="px-3 py-2">Activity</th>
                    <th className="px-3 py-2">Calories</th>
                    <th className="px-3 py-2">Carbs</th>
                    <th className="px-3 py-2">Protein</th>
                    <th className="px-3 py-2">Fats</th>
                    <th className="px-3 py-2">Fibre</th>
                  </tr>
                </thead>

                <tbody>
                  {logs.map((entry, index) => (
                    <tr
                      key={index}
                      className={`
                        group transform-gpu transition-all duration-300
                        hover:-translate-y-1 hover:scale-[1.008]
                        hover:drop-shadow-[0_12px_30px_rgba(0,0,0,0.18)]
                      `}
                    >
                      <td className="px-3 py-2 first:rounded-l-xl bg-transparent group-hover:bg-white/40 transition-colors">
                        {entry.date}
                      </td>
                      <td className="px-3 py-2 bg-transparent group-hover:bg-white/40 transition-colors">
                        {renderWeight(entry.weight)}
                      </td>
                      <td className="px-3 py-2 bg-transparent group-hover:bg-white/40 transition-colors">
                        {entry.activity?.type
                          ? `${entry.activity.type} (${entry.activity.steps || 0} steps, ${entry.activity.duration || 0} min)`
                          : "-"}
                      </td>
                      <td className="px-3 py-2 bg-transparent group-hover:bg-white/40 transition-colors">
                        {entry.macros?.calories || 0} kcal
                      </td>
                      <td className="px-3 py-2 bg-transparent group-hover:bg-white/40 transition-colors">
                        {entry.macros?.carbs || 0} g
                      </td>
                      <td className="px-3 py-2 bg-transparent group-hover:bg-white/40 transition-colors">
                        {entry.macros?.protein || 0} g
                      </td>
                      <td className="px-3 py-2 bg-transparent group-hover:bg-white/40 transition-colors">
                        {entry.macros?.fat || 0} g
                      </td>
                      <td className="px-3 py-2 last:rounded-r-xl bg-transparent group-hover:bg-white/40 transition-colors">
                        {entry.macros?.fiber || 0} g
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
              <button
                onClick={handleExportCSV}
                disabled={exporting}
                className="
                  relative px-4 py-2 rounded-full font-semibold
                  bg-gradient-to-r from-[#4338CA] via-[#6D28D9] to-[#7C3AED]
                  text-white ring-1 ring-white/50 shadow-md
                  hover:shadow-xl hover:brightness-[1.08] active:brightness-95
                  transition disabled:opacity-60
                "
              >
                {exporting ? "Exporting..." : "Export as CSV ⬇️"}
              </button>

              <button
                className="
                  relative px-4 py-2 rounded-full font-semibold
                  bg-gradient-to-r from-[#F59E0B] via-[#F97316] to-[#EF4444]
                  text-white ring-1 ring-white/50 shadow-md
                  hover:shadow-xl hover:brightness-[1.08] active:brightness-95
                  transition
                "
                title="(Optional) We can wire this to Trends later"
              >
                View Trends 📈
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogBook;