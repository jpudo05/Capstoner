'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTourismKPIs, calculateSustainabilityScore, getTimeSeriesData } from '@/lib/analytics';
import KPICard from '@/components/ui/KPICard';
import SubsystemBreakdown from '@/components/ui/SubsystemBreakdown';
import TimeSeriesChart from '@/components/ui/TimeSeriesChart';

export default function AnalyticsDashboard() {
  const [kpis, setKpis] = useState(null);
  const [sustainabilityScore, setSustainabilityScore] = useState(null);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [kpiData, score, seriesData] = await Promise.all([
        getTourismKPIs(),
        calculateSustainabilityScore(),
        getTimeSeriesData(selectedPeriod),
      ]);

      setKpis(kpiData);
      setSustainabilityScore(score);
      setTimeSeriesData(seriesData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  // Color Coding per Developer Onboarding Standards:
  // Success: bg-green-500, Warning: bg-yellow-500, Error: bg-red-600
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500'; // Success color
    if (score >= 60) return 'text-yellow-500'; // Warning color
    return 'text-red-600'; // Error color
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-500'; // Success
    if (score >= 60) return 'bg-yellow-500'; // Warning
    return 'bg-red-600'; // Error
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-900 font-semibold">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm mb-2 block">
                ← Back to Home
              </Link>
              <h1 className="text-3xl font-bold text-blue-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Real-time Tourism Impact Monitoring</p>
            </div>
            <button
              onClick={loadDashboardData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors shadow-lg"
              title="Refresh real-time tourism data"
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* KPI Cards - Thesis Objective 1: Real-time tourism KPIs */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Revenue"
            value={formatCurrency(kpis?.totalRevenue || 0)}
            icon="💰"
            color="blue"
            subtitle="Economic Impact"
          />
          <KPICard
            title="Visitor Count"
            value={(kpis?.visitorCount || 0).toLocaleString()}
            icon="👥"
            color="green"
            subtitle="Tourist Volume"
          />
          <KPICard
            title="Jobs Created"
            value={(kpis?.jobsCreated || 0).toLocaleString()}
            icon="💼"
            color="purple"
            subtitle="Employment Impact"
          />
          {/* Sustainability Score Card - AI-powered evaluation */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-2">🌿</div>
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Sustainability Score</h3>
            <div className="flex items-center gap-2 mb-2">
              <div className={`text-4xl font-bold ${getScoreColor(sustainabilityScore)}`}>
                {sustainabilityScore}
              </div>
              <div className={`h-3 w-3 rounded-full ${getScoreBgColor(sustainabilityScore)} animate-pulse`}></div>
            </div>
            <div className="text-sm text-gray-500 mt-2">
              {getScoreLabel(sustainabilityScore)}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Policy Impact Evaluation
            </div>
          </div>
        </div>

        {/* Time Series Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Activity Trends</h2>
            <div className="flex gap-2">
              {['week', 'month', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
                    selectedPeriod === period
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <TimeSeriesChart data={timeSeriesData} />
        </div>

        {/* Subsystem Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Subsystem Activity</h2>
          <SubsystemBreakdown data={kpis?.subsystemBreakdown || {}} />
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Avg. Revenue per Visitor</h3>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency((kpis?.totalRevenue || 0) / (kpis?.visitorCount || 1))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Active Subsystems</h3>
            <div className="text-2xl font-bold text-green-600">
              {Object.keys(kpis?.subsystemBreakdown || {}).length} / 11
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Avg. Transactions per Visitor</h3>
            <div className="text-2xl font-bold text-purple-600">
              {((kpis?.totalTransactions || 0) / (kpis?.visitorCount || 1)).toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
