export default function KPICard({ title, value, icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="text-sm font-semibold text-gray-600 mb-2">{title}</h3>
      <div className={`text-4xl font-bold ${colorClasses[color] || colorClasses.blue}`}>
        {value}
      </div>
    </div>
  );
}
