export default function SubsystemBreakdown({ data }) {
  const subsystemNames = {
    info: 'Tourist Information',
    workflow: 'Workflow Management',
    museum: 'Museum System',
    experiences: 'Local Experiences',
    programs: 'Tourism Programs',
    crisis: 'Crisis Management',
    shop: 'E-commerce Shop',
    tours: 'Tour Bookings',
    feedback: 'Feedback System',
    analytics: 'Analytics',
    rewards: 'Rewards System',
  };

  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-4xl mb-4">📊</div>
        <p>No subsystem data available yet.</p>
        <p className="text-sm mt-2">Data will appear as users interact with the system.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map(([subsystem, count]) => {
        const percentage = total > 0 ? (count / total) * 100 : 0;
        const displayName = subsystemNames[subsystem] || subsystem;

        return (
          <div key={subsystem}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">{displayName}</span>
              <span className="text-sm text-gray-600">
                {count} ({percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
