
import Navbar from "../components/Navbar";

const ProgressCircle = ({ percentage, value }: { percentage: number; value: string }) => (
  <div className="relative w-24 h-24 rounded-full border-[6px] border-orange-400 flex items-center justify-center">
    <div className="text-center text-blue-700 font-bold">
      <div>{percentage}%</div>
      <div className="text-xs text-blue-500">{value}</div>
    </div>
  </div>
);

const ProgressBar = ({ label, current, total }: { label: string; current: number; total: number }) => (
  <div className="mb-2">
    <div className="flex justify-between text-xs text-blue-700 font-semibold">
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
  return (
    <div className="min-h-screen bg-lightblue px-6 py-8">
      <Navbar />

      <div className="flex flex-wrap justify-center gap-6 mt-10">
        {/* Left Placeholder */}
        <div className="bg-red-100 w-[450px] h-[450px] rounded-2xl"></div>

        {/* Right Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-100 p-4 rounded-2xl flex flex-col items-center">
            <div className="flex justify-between w-full">
              <h2 className="text-blue-700 font-bold">Steps</h2>
              <span>✏️</span>
            </div>
            <ProgressCircle percentage={30} value="3000/10000" />
          </div>

          <div className="bg-red-100 p-4 rounded-2xl flex flex-col items-center">
            <div className="flex justify-between w-full">
              <h2 className="text-blue-700 font-bold">Weight</h2>
              <span>✏️</span>
            </div>
            <ProgressCircle percentage={80} value="40/50" />
          </div>

          <div className="bg-red-100 p-4 rounded-2xl flex flex-col items-center">
            <div className="flex justify-between w-full">
              <h2 className="text-blue-700 font-bold">Workout</h2>
              <span>✏️</span>
            </div>
            <div className="text-3xl my-2">🏋️‍♀️</div>
            <div className="text-blue-800 font-semibold">Leg Day</div>
            <div className="text-orange-500 text-sm">45 mins</div>
          </div>

          <div className="bg-red-100 p-4 rounded-2xl">
            <div className="flex justify-between mb-2">
              <h2 className="text-blue-700 font-bold">Macros</h2>
              <span>✏️</span>
            </div>
            <ProgressBar label="Calories" current={400} total={1200} />
            <ProgressBar label="Carbohydrates" current={120} total={200} />
            <ProgressBar label="Protein" current={80} total={120} />
            <ProgressBar label="Fibre" current={20} total={40} />
          </div>

          <div className="bg-red-100 p-4 rounded-2xl col-span-2 text-center">
            <h2 className="text-blue-700 font-bold">Workout Streak</h2>
            <div className="text-xl mt-2">5🔥</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;
