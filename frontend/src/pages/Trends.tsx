import Navbar from "../components/Navbar";
import React from "react";

const ChartCard = ({
  title,
  chartLabel,
  buttons,
}: {
  title: string;
  chartLabel: string;
  buttons: string[];
}) => {
  return (
    <div className="bg-[#FEEFEF] w-[400px] rounded-2xl p-4 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <button className="text-[#007BFF] text-xl font-bold">&larr;</button>
        <h2 className="text-[#007BFF] font-semibold text-lg">{title}</h2>
        <div style={{ width: 24 }}></div>
      </div>
      <div className="border border-[#ccc] rounded-xl h-[150px] flex items-center justify-center">
        <span className="text-[#007BFF]">{chartLabel}</span>
      </div>
      <div className="flex justify-around mt-4">
        {buttons.map((btn, i) => (
          <button
            key={i}
            className="bg-gradient-to-r from-[#B1D5E5] to-[#F48C74] px-4 py-1 rounded-full text-white font-medium text-sm"
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="bg-[#8EC1DD] min-h-screen">
      <div className="pt-6">
        <Navbar />
      </div>

      <div className="flex flex-wrap justify-center gap-8 mt-10">
        <ChartCard
          title="Weight Trends"
          chartLabel="Line chart"
          buttons={["Daily", "Weekly", "Monthly"]}
        />
        <ChartCard
          title="Activity"
          chartLabel="Different Charts"
          buttons={["Duration", "Activity", "Calories burned"]}
        />
        <ChartCard
          title="Calorie Intake"
          chartLabel="Line chart"
          buttons={["Daily", "Weekly", "Monthly"]}
        />
        <ChartCard
          title="Macros Goals"
          chartLabel="Different Chart"
          buttons={["Daily", "Weekly", "Monthly"]}
        />
      </div>
    </div>
  );
};

export default Dashboard;
