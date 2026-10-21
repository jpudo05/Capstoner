import { supabase } from './supabaseClient';

/**
 * Get aggregated tourism KPIs
 * Aligns with Thesis Objective 1: Develop an integrated analytics dashboard
 * that displays real-time tourism KPIs including revenue, jobs created, and visitor volume
 * @returns {Promise<Object>} KPI metrics
 */
export const getTourismKPIs = async () => {
  try {
    // INPUT: Transactional and Booking Data from reward_history table
    const { data: rewardData, error: rewardError } = await supabase
      .from('reward_history')
      .select('points_earned, subsystem_source');

    if (rewardError) throw rewardError;

    const totalPoints = rewardData?.reduce((sum, record) => sum + record.points_earned, 0) || 0;
    // PROCESS: Data Aggregation - 1 point = ₱10 in economic value
    const estimatedRevenue = totalPoints * 10;

    // INPUT: Student and Visitor Information from profiles via reward_history
    const { data: uniqueVisitors, error: visitorError } = await supabase
      .from('reward_history')
      .select('user_id');

    if (visitorError) throw visitorError;

    const uniqueVisitorCount = new Set(uniqueVisitors?.map(r => r.user_id)).size;

    // PROCESS: System Development - Subsystem breakdown calculation
    const subsystemBreakdown = {};
    rewardData?.forEach(record => {
      const subsystem = record.subsystem_source || 'unknown';
      subsystemBreakdown[subsystem] = (subsystemBreakdown[subsystem] || 0) + 1;
    });

    // OUTPUT: Integrated Analytics Dashboard data
    return {
      totalRevenue: estimatedRevenue,
      visitorCount: uniqueVisitorCount,
      totalTransactions: rewardData?.length || 0,
      subsystemBreakdown,
      jobsCreated: Math.floor(estimatedRevenue / 50000), // Estimated jobs (1 job per ₱50k revenue)
    };
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    return {
      totalRevenue: 0,
      visitorCount: 0,
      totalTransactions: 0,
      subsystemBreakdown: {},
    };
  }
};

/**
 * Calculate Tourism Sustainability Score (0-100)
 * PROCESS: Sustainability Calculation
 * Evaluates policy impact based on visitor distribution, resource usage, and economic efficiency
 * Aligns with Purpose: "calculating an automated Tourism Sustainability Score to evaluate policy impact"
 * @returns {Promise<number>} Score from 0-100
 */
export const calculateSustainabilityScore = async () => {
  try {
    const kpis = await getTourismKPIs();
    
    // AI-powered sustainability model
    let score = 50; // Base score (neutral)

    // Factor 1: Subsystem Diversity (spread across tourism offerings)
    // Good: 80-100 | Fair: 60-79 | Needs Improvement: 0-59
    const subsystemCount = Object.keys(kpis.subsystemBreakdown).length;
    if (subsystemCount >= 8) score += 20; // Excellent diversity
    else if (subsystemCount >= 5) score += 10; // Good diversity
    else if (subsystemCount < 3) score -= 10; // Poor diversity

    // Factor 2: Resource Strain (moderate engagement is sustainable)
    const avgTransactionsPerVisitor = kpis.totalTransactions / (kpis.visitorCount || 1);
    if (avgTransactionsPerVisitor >= 3 && avgTransactionsPerVisitor <= 8) {
      score += 20; // Optimal engagement
    } else if (avgTransactionsPerVisitor > 10) {
      score -= 15; // Potential overcrowding/resource strain
    }

    // Factor 3: Economic Efficiency (revenue per visitor)
    const revenuePerVisitor = kpis.totalRevenue / (kpis.visitorCount || 1);
    if (revenuePerVisitor >= 500 && revenuePerVisitor <= 2000) {
      score += 10; // Sustainable spending
    } else if (revenuePerVisitor > 3000) {
      score += 5; // High-value tourism (good but monitor exclusivity)
    }

    // Return OUTPUT: Sustainability score (clamped 0-100)
    return Math.min(Math.max(score, 0), 100);
  } catch (error) {
    console.error('Error calculating sustainability score:', error);
    return 50; // Default neutral score
  }
};

/**
 * Get time-series data for charts
 * @param {string} period - 'week', 'month', 'year'
 * @returns {Promise<Array>}
 */
export const getTimeSeriesData = async (period = 'week') => {
  try {
    const now = new Date();
    let startDate;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const { data, error } = await supabase
      .from('reward_history')
      .select('created_at, points_earned, subsystem_source')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching time series data:', error);
    return [];
  }
};

/**
 * AI-Powered Predictive Model for Tourism Forecasting
 * Aligns with Thesis Objective 2: Implement predictive modeling for forecasting
 * visitor spending and identifying potential risks like resource strain
 * PROCESS: AI-powered predictive modeling
 * @returns {Promise<Object>} Forecast data with confidence level
 */
export const getForecast = async () => {
  try {
    const historicalData = await getTimeSeriesData('month');
    
    // Insufficient data validation
    if (historicalData.length < 7) {
      return {
        predictedRevenue: 0,
        predictedVisitors: 0,
        predictedResourceStrain: 'Unknown',
        confidence: 'low',
        message: 'Insufficient historical data for accurate prediction'
      };
    }

    // AI Model: Moving Average with Trend Analysis
    const recentWeek = historicalData.slice(-7);
    const previousWeek = historicalData.slice(-14, -7);
    
    const avgDailyPoints = recentWeek.reduce((sum, d) => sum + d.points_earned, 0) / 7;
    const prevAvgDailyPoints = previousWeek.length > 0 
      ? previousWeek.reduce((sum, d) => sum + d.points_earned, 0) / 7 
      : avgDailyPoints;
    
    // Trend calculation
    const trendFactor = avgDailyPoints > 0 ? avgDailyPoints / Math.max(prevAvgDailyPoints, 1) : 1;
    
    // Next week revenue forecast
    const predictedRevenue = Math.round(avgDailyPoints * trendFactor * 10 * 7);
    
    // Visitor prediction with trend
    const uniqueVisitors = new Set(recentWeek.map(d => d.user_id)).size;
    const predictedVisitors = Math.round(uniqueVisitors * trendFactor);

    // Resource strain prediction (identifying potential risks)
    let resourceStrain = 'Low';
    if (predictedVisitors > 1000) resourceStrain = 'High';
    else if (predictedVisitors > 500) resourceStrain = 'Moderate';

    // Confidence level based on data volume
    let confidence = 'low';
    if (historicalData.length >= 60) confidence = 'high';
    else if (historicalData.length >= 30) confidence = 'medium';

    return {
      predictedRevenue,
      predictedVisitors,
      predictedResourceStrain: resourceStrain,
      confidence,
      trend: trendFactor > 1.1 ? 'Growing' : trendFactor < 0.9 ? 'Declining' : 'Stable'
    };
  } catch (error) {
    console.error('Error generating forecast:', error);
    return {
      predictedRevenue: 0,
      predictedVisitors: 0,
      predictedResourceStrain: 'Unknown',
      confidence: 'low',
    };
  }
};
