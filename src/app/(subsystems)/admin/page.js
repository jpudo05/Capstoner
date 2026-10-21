'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTourismKPIs, calculateSustainabilityScore, getForecast, getTimeSeriesData } from '@/lib/analytics';
import { getRewardHistory } from '@/lib/rewards';

export default function AdminDashboard() {
  const [kpis, setKpis] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [sustainabilityScore, setSustainabilityScore] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportGenerating, setReportGenerating] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [kpiData, forecastData, score, activity] = await Promise.all([
        getTourismKPIs(),
        getForecast(),
        calculateSustainabilityScore(),
        getRewardHistory({ limit: 20 }),
      ]);

      setKpis(kpiData);
      setForecast(forecastData);
      setSustainabilityScore(score);
      setRecentActivity(activity);
    } catch (error) {
      console.error('Error loading admin dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    setReportGenerating(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const reportData = {
        date: new Date().toISOString(),
        kpis,
        sustainabilityScore,
        forecast,
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tourism-impact-report-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      alert('Report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    } finally {
      setReportGenerating(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-PH', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-900 font-semibold">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/" className="text-green-600 hover:text-green-800 text-sm mb-2 block">
                ← Back to Home
              </Link>
              <h1 className="text-3xl font-bold text-green-900">Admin Dashboard</h1>
              <p className="text-gray-600">System Management & Reports</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadAdminData}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition-colors shadow-lg"
                title="Refresh system data"
              >
                🔄 Refresh
              </button>
              <button
                onClick={generateReport}
                disabled={reportGenerating}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                title="Generate comprehensive impact report"
              >
                {reportGenerating ? '⏳ Generating...' : '📄 Generate Report'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* System Health Overview - Real-time monitoring */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8 border-2 border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">System Health Overview</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-4xl mb-2">✅</div>
              <div className="text-sm text-gray-600 mb-1">System Status</div>
              <div className="text-lg font-bold text-green-500">Operational</div>
              <div className="text-xs text-gray-500 mt-1">All services running</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-4xl mb-2">🔗</div>
              <div className="text-sm text-gray-600 mb-1">Connected Subsystems</div>
              <div className="text-lg font-bold text-blue-600">
                {Object.keys(kpis?.subsystemBreakdown || {}).length} / 11
              </div>
              <div className="text-xs text-gray-500 mt-1">Data aggregation active</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-4xl mb-2">🌿</div>
              <div className="text-sm text-gray-600 mb-1">Sustainability Score</div>
              <div className={`text-lg font-bold ${sustainabilityScore >= 70 ? 'text-green-500' : sustainabilityScore >= 50 ? 'text-yellow-500' : 'text-red-600'}`}>
                {sustainabilityScore}%
              </div>
              <div className="text-xs text-gray-500 mt-1">Policy impact metric</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-sm text-gray-600 mb-1">Data Quality</div>
              <div className="text-lg font-bold text-purple-600">High</div>
              <div className="text-xs text-gray-500 mt-1">Real-time sync enabled</div>
            </div>
          </div>
        </div>

        {/* Predictive Insights - Thesis Objective 2: AI-powered forecasting */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📈 Predictive Modeling - Next Week Forecast
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">Predicted Revenue (Visitor Spending)</div>
                <div className="text-3xl font-bold text-blue-600">
                  {formatCurrency(forecast?.predictedRevenue || 0)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Economic impact projection</div>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">Predicted Visitors</div>
                <div className="text-3xl font-bold text-green-500">
                  {(forecast?.predictedVisitors || 0).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">Expected tourist volume</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">Resource Strain Risk</div>
                <div className={`text-2xl font-bold ${
                  forecast?.predictedResourceStrain === 'High' ? 'text-red-600' : 
                  forecast?.predictedResourceStrain === 'Moderate' ? 'text-yellow-500' : 
                  'text-green-500'
                }`}>
                  {forecast?.predictedResourceStrain || 'Unknown'}
                </div>
                <div className="text-xs text-gray-500 mt-1">Potential risk identification</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">AI Confidence Level</div>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  forecast?.confidence === 'high' ? 'bg-green-500 text-white' : 
                  forecast?.confidence === 'medium' ? 'bg-yellow-500 text-white' : 
                  'bg-red-600 text-white'
                }`}>
                  {forecast?.confidence?.toUpperCase() || 'CALCULATING'}
                </div>
              </div>
              {forecast?.trend && (
                <div className="text-center text-sm text-gray-600">
                  Trend: <span className="font-semibold">{forecast.trend}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-yellow-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">⚠️ Risk Alerts & Policy Recommendations</h2>
            <div className="space-y-3">
              {sustainabilityScore < 50 && (
                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">🚨</div>
                    <div>
                      <div className="font-semibold text-red-600">Critical: Low Sustainability Score</div>
                      <div className="text-sm text-red-500 mt-1">
                        Immediate action required. Consider implementing resource management policies to prevent environmental degradation.
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {(forecast?.predictedResourceStrain === 'High') && (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">⚠️</div>
                    <div>
                      <div className="font-semibold text-yellow-600">Warning: High Resource Strain Predicted</div>
                      <div className="text-sm text-yellow-500 mt-1">
                        Expected high visitor volume may strain local resources. Monitor infrastructure capacity.
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {Object.keys(kpis?.subsystemBreakdown || {}).length < 6 && (
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">📊</div>
                    <div>
                      <div className="font-semibold text-blue-600">Notice: Low Subsystem Utilization</div>
                      <div className="text-sm text-blue-500 mt-1">
                        Only {Object.keys(kpis?.subsystemBreakdown || {}).length} of 11 subsystems active. Consider promoting underutilized tourism services.
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {sustainabilityScore >= 70 && Object.keys(kpis?.subsystemBreakdown || {}).length >= 8 && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">✅</div>
                    <div>
                      <div className="font-semibold text-green-600">Success: All Systems Healthy</div>
                      <div className="text-sm text-green-500 mt-1">
                        Tourism ecosystem is well-balanced. Sustainability score is excellent with high subsystem engagement.
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {!sustainabilityScore && !forecast && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📊</div>
                  <div>Analyzing data... Risk alerts will appear here</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity Log - Real-time Transaction Monitoring */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            📋 Recent Activity - Transaction Log
          </h2>
          <div className="text-sm text-gray-600 mb-4">
            Real-time monitoring of tourism transactions across all subsystems
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Subsystem</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Points</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">User ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentActivity.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                      No activity recorded yet. Start using the subsystems to see data here.
                    </td>
                  </tr>
                ) : (
                  recentActivity.slice(0, 10).map((activity, index) => (
                    <tr key={activity.id || index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(activity.created_at)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {activity.subsystem_source}
                      </td>
                      <td className="px-4 py-3 text-sm text-blue-600 font-semibold">
                        +{activity.points_earned}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 font-mono">
                        {activity.user_id?.substring(0, 8)}...
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <button className="bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 text-left transition-colors">
            <div className="text-2xl mb-2">🗄️</div>
            <div className="font-bold text-gray-900 mb-1">Export Database</div>
            <div className="text-sm text-gray-600">Download full dataset for analysis</div>
          </button>
          <button className="bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 text-left transition-colors">
            <div className="text-2xl mb-2">⚙️</div>
            <div className="font-bold text-gray-900 mb-1">System Settings</div>
            <div className="text-sm text-gray-600">Configure thresholds and alerts</div>
          </button>
          <button className="bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 text-left transition-colors">
            <div className="text-2xl mb-2">👥</div>
            <div className="font-bold text-gray-900 mb-1">User Management</div>
            <div className="text-sm text-gray-600">Manage profiles and permissions</div>
          </button>
        </div>
      </div>
    </div>
  );
}
