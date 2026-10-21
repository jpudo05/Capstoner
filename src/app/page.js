import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-900 mb-4">
            CONNECT-Daet.ph
          </h1>
          <p className="text-xl text-blue-700 mb-2">
            Tourism Impact Assessment and Data Analytics System
          </p>
          <p className="text-gray-600">
            Municipality of Daet, Camarines Norte
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Analytics Dashboard Card */}
          <Link href="/analytics">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-2 border-blue-200 hover:border-blue-400">
              <div className="text-4xl mb-4">📊</div>
              <h2 className="text-2xl font-bold text-blue-900 mb-3">
                Analytics Dashboard
              </h2>
              <p className="text-gray-600 mb-4">
                Real-time tourism KPIs including revenue, jobs created, and visitor volume.
              </p>
              <div className="text-blue-600 font-semibold">
                View Analytics →
              </div>
            </div>
          </Link>

          {/* Admin Dashboard Card */}
          <Link href="/admin">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-2 border-green-200 hover:border-green-400">
              <div className="text-4xl mb-4">⚙️</div>
              <h2 className="text-2xl font-bold text-green-900 mb-3">
                Admin Dashboard
              </h2>
              <p className="text-gray-600 mb-4">
                Generate reports, forecast trends, and monitor sustainability scores.
              </p>
              <div className="text-green-600 font-semibold">
                Access Admin →
              </div>
            </div>
          </Link>
        </div>

        {/* System Overview */}
        <div className="mt-12 max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">System Capabilities</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">📈</div>
              <h4 className="font-semibold text-gray-900 mb-2">Predictive Modeling</h4>
              <p className="text-sm text-gray-600">
                AI-powered forecasting for visitor spending and resource strain
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🌿</div>
              <h4 className="font-semibold text-gray-900 mb-2">Sustainability Score</h4>
              <p className="text-sm text-gray-600">
                Automated evaluation of tourism policy impact
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📱</div>
              <h4 className="font-semibold text-gray-900 mb-2">Real-time Monitoring</h4>
              <p className="text-sm text-gray-600">
                Live data aggregation from all 11 integrated subsystems
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600">
          <p className="text-sm">
            © 2026 Our Lady of Lourdes College Foundation | Team 10 Analytics
          </p>
        </div>
      </div>
    </main>
  );
}
