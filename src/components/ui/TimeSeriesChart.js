'use client';

export default function TimeSeriesChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-4xl mb-4">📈</div>
        <p>No time series data available yet.</p>
        <p className="text-sm mt-2">Charts will appear as data accumulates over time.</p>
      </div>
    );
  }

  // Group data by date
  const dailyData = data.reduce((acc, item) => {
    const date = new Date(item.created_at).toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
    });
    if (!acc[date]) {
      acc[date] = { date, points: 0, count: 0 };
    }
    acc[date].points += item.points_earned;
    acc[date].count += 1;
    return acc;
  }, {});

  const chartData = Object.values(dailyData);
  const maxPoints = Math.max(...chartData.map(d => d.points), 1);
  const maxCount = Math.max(...chartData.map(d => d.count), 1);

  return (
    <div className="space-y-6">
      {/* Simple bar chart */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-4">Daily Points Earned</h3>
        <div className="flex items-end justify-between h-48 gap-2">
          {chartData.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center justify-end">
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-500"
                style={{ height: `${(item.points / maxPoints) * 100}%` }}
                title={`${item.date}: ${item.points} points`}
              ></div>
              <div className="text-xs text-gray-600 mt-2 rotate-45 origin-left whitespace-nowrap">
                {item.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction count */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-4">Daily Transactions</h3>
        <div className="flex items-end justify-between h-32 gap-2">
          {chartData.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center justify-end">
              <div
                className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all hover:from-green-600 hover:to-green-500"
                style={{ height: `${(item.count / maxCount) * 100}%` }}
                title={`${item.date}: ${item.count} transactions`}
              ></div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-gray-600">Points Earned</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-600">Transactions</span>
        </div>
      </div>
    </div>
  );
}
