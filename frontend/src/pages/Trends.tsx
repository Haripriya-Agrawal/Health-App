import Navbar from "../components/Navbar";


// Dummy Chart Components
const LineChart = () => (
  <div className="relative h-full w-full">
    <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 h-3/4">
      {[30, 50, 70, 90, 60, 40, 80].map((height, i) => (
        <div
          key={i}
          className="w-6 bg-gradient-to-t from-[#067BC2] to-[#84BCDA] rounded-t-sm"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  </div>
);

const ActivityChart = () => (
  <div className="flex items-end h-full space-x-3 px-4">
    {[40, 60, 30, 80, 50].map((height, i) => (
      <div
        key={i}
        className="w-6 bg-gradient-to-t from-[#F37748] to-[#ECC30B] rounded-t-sm"
        style={{ height: `${height}%` }}
      />
    ))}
  </div>
);

const MacrosChart = () => (
  <div className="relative h-24 w-24 mx-auto">
    <div className="absolute inset-0 rounded-full border-8 border-[#067BC2] clip-[0_50%_0_0]" />
    <div className="absolute inset-0 rounded-full border-8 border-[#F37748] clip-[0_0_50%_0]" />
    <div className="absolute inset-0 rounded-full border-8 border-[#ECC30B] clip-[50%_0_0_0]" />
  </div>
);

const ChartCard = ({
  title,
  
  buttons,
  chartComponent,
}: {
  title: string;
  chartLabel: string;
  buttons: string[];
  chartComponent: React.ReactNode;
}) => {
  return (
    <div className="bg-[#FEEFEF] w-[300px] rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <button className="text-[#007BFF] hover:text-[#F37748] text-xl font-bold transition-colors">
          &larr;
        </button>
        <h2 className="text-[#007BFF] font-semibold text-lg">{title}</h2>
        <div style={{ width: 24 }}></div>
      </div>
      <div className="border border-[#ccc] rounded-xl h-[150px] flex items-center justify-center mb-3">
        {chartComponent}
      </div>
      <div className="flex justify-around mt-2">
        {buttons.map((btn, i) => (
          <button
            key={i}
            className="bg-gradient-to-r from-[#B1D5E5] to-[#F48C74] hover:from-[#84BCDA] hover:to-[#F37748] 
                     px-3 py-1 rounded-full text-white font-medium text-xs shadow-sm
                     transition-all duration-200 transform hover:scale-105"
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
    <div className="bg-lightblue  min-h-screen p-4">
      <div className="pt-6">
        <Navbar />
      </div>

      <div className="flex flex-col items-center">
        {/* <h1 className="text-2xl font-bold text-[#00263D] my-6">Health Dashboard</h1> */}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl mt-12 mx-auto">
          {/* Weight Trends Card */}
          <ChartCard
            title="Weight Trends"
            chartLabel="Line chart"
            buttons={["Daily", "Weekly", "Monthly"]}
            chartComponent={<LineChart />}
          />
          
          {/* Activity Card */}
          <ChartCard
            title="Activity"
            chartLabel="Bar chart"
            buttons={["Steps", "Duration", "Calories"]}
            chartComponent={<ActivityChart />}
          />
          
          {/* Calorie Intake Card */}
          <ChartCard
            title="Calorie Intake"
            chartLabel="Line chart"
            buttons={["Breakfast", "Lunch", "Dinner"]}
            chartComponent={<LineChart />}
          />
          
          {/* Macros Goals Card */}
          <ChartCard
            title="Macros Goals"
            chartLabel="Pie chart"
            buttons={["Carbs", "Protein", "Fat"]}
            chartComponent={<MacrosChart />}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;