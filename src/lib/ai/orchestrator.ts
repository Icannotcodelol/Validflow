import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { Analysis } from '@/types/analysis';
import { BaseSectionResponse } from './models';

type AnalysisDocument = Database['public']['Tables']['analyses']['Row']

export class Orchestrator {
  private supabase: SupabaseClient<Database>;

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase;
  }

  async createAnalysis(userId: string): Promise<string> {
    console.log(`[Orchestrator] Attempting to create analysis record for user ID: ${userId}`);
    try {
      const { data, error } = await this.supabase
        .from('analyses')
        .insert({
          user_id: userId,
          status: 'pending',
          sections: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('[Orchestrator] Supabase error creating analysis:', error);
        throw new Error(`Failed to create analysis: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from analysis creation');
      }

      console.log(`[Orchestrator] Successfully created analysis record with ID: ${data.id}`);
      return data.id;
    } catch (error) {
      console.error('[Orchestrator] Error caught in createAnalysis:', error);
      throw error;
    }
  }

  async getAnalysis(analysisId: string): Promise<AnalysisDocument | null> {
    try {
      const { data, error } = await this.supabase
        .from('analyses')
        .select('*')
        .eq('id', analysisId)
        .single();

      if (error) {
        console.error('Error fetching analysis:', error);
        throw new Error(`Failed to fetch analysis: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in getAnalysis:', error);
      throw error;
    }
  }

  async updateAnalysisSection(
    analysisId: string,
    sectionKey: string,
    sectionData: any,
    status: string = 'completed'
  ): Promise<void> {
    try {
      // First, get the current sections
      const { data: currentAnalysis, error: fetchError } = await this.supabase
        .from('analyses')
        .select('sections')
        .eq('id', analysisId)
        .single();

      if (fetchError) {
        console.error('Error fetching current analysis:', fetchError);
        throw new Error(`Failed to fetch current analysis: ${fetchError.message}`);
      }

      // Create a properly structured section response
      const sectionResponse: BaseSectionResponse = {
        sectionId: sectionKey,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: status as 'pending' | 'completed' | 'failed',
        data: sectionData
      };

      // Merge the new section data with existing sections
      const updatedSections = {
        ...(currentAnalysis?.sections || {}),
        [sectionKey]: sectionResponse
      };

      const { error: updateError } = await this.supabase
        .from('analyses')
        .update({
          sections: updatedSections,
          updated_at: new Date().toISOString()
        })
        .eq('id', analysisId);

      if (updateError) {
        console.error('Error updating analysis section:', updateError);
        throw new Error(`Failed to update analysis section: ${updateError.message}`);
      }
    } catch (error) {
      console.error('Error in updateAnalysisSection:', error);
      throw error;
    }
  }

  async updateAnalysisStatus(
    analysisId: string,
    status: string
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('analyses')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', analysisId);

      if (error) {
        console.error('Error updating analysis status:', error);
        throw new Error(`Failed to update analysis status: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in updateAnalysisStatus:', error);
      throw error;
    }
  }

  async checkUserCredits(userId: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from('user_credits')
        .select('free_analysis_used')
        .eq('user_id', userId)
        .single();

      if (error) {
        // If no record exists, create one
        if (error.code === 'PGRST116') {
          const { error: insertError } = await this.supabase
            .from('user_credits')
            .insert({
              user_id: userId,
              free_analysis_used: false
            });
          if (insertError) {
            console.error('Error creating user credits:', insertError);
            throw new Error(`Failed to create user credits: ${insertError.message}`);
          }
          return false;
        }
        console.error('Error checking user credits:', error);
        throw new Error(`Failed to check user credits: ${error.message}`);
      }

      return data.free_analysis_used;
    } catch (error) {
      console.error('Error in checkUserCredits:', error);
      throw error;
    }
  }

  async markFreeAnalysisUsed(userId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('user_credits')
        .update({ free_analysis_used: true })
        .eq('user_id', userId);

      if (error) {
        console.error('Error marking free analysis used:', error);
        throw new Error(`Failed to mark free analysis used: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in markFreeAnalysisUsed:', error);
      throw error;
    }
  }

  async getUserAnalyses(userId: string): Promise<Analysis[]> {
    console.log(`[Orchestrator] Fetching analyses for user ID: ${userId}`);
    try {
      const { data, error } = await this.supabase
        .from('analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[Orchestrator] Supabase error fetching analyses:', error);
        throw new Error(`Failed to fetch analyses: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('[Orchestrator] Error caught in getUserAnalyses:', error);
      throw error;
    }
  }
} 