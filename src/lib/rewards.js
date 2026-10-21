import { supabase } from './supabaseClient';

/**
 * Add points to a user's profile and log the transaction
 * This is the integration hook that all 11 subsystems will call
 * 
 * @param {string} userId - The user's UUID from the profiles table
 * @param {number} points - Points to award
 * @param {string} source - Identifier of the subsystem (e.g., 'museum_qr_scan', 'tour_booking')
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const addPoints = async (userId, points, source) => {
  try {
    // 1. Update the user's total points in profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return { success: false, error: profileError.message };
    }

    const currentPoints = profileData?.points || 0;
    const newTotal = currentPoints + points;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ points: newTotal })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating points:', updateError);
      return { success: false, error: updateError.message };
    }

    // 2. Insert transaction into reward_history table
    const { error: historyError } = await supabase
      .from('reward_history')
      .insert({
        user_id: userId,
        subsystem_source: source,
        points_earned: points,
      });

    if (historyError) {
      console.error('Error logging reward history:', historyError);
      return { success: false, error: historyError.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error in addPoints:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get reward history for analytics and admin reporting
 * INPUT: Filters for transactional data query
 * OUTPUT: Historical transaction data for Comprehensive Impact Reports
 * Aligns with Thesis Objective 3: Automate the generation of comprehensive tourism impact reports
 * @param {Object} filters - Optional filters (userId, subsystem, dateRange, limit)
 * @returns {Promise<Array>}
 */
export const getRewardHistory = async (filters = {}) => {
  try {
    let query = supabase
      .from('reward_history')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }

    if (filters.subsystem) {
      query = query.eq('subsystem_source', filters.subsystem);
    }

    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching reward history:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error in getRewardHistory:', error);
    return [];
  }
};
