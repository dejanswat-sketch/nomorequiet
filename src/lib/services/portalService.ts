'use client';

import { createClient } from '@/lib/supabase/client';
import type {
  PortalSession,
  PortalSessionRow,
  PortalRound,
  PortalRoundRow,
  UserNode,
} from '@/lib/supabase/types';

function rowToSession(row: PortalSessionRow): PortalSession {
  return {
    id: row.id,
    userId: row.user_id,
    node: row.node,
    status: row.status,
    currentRound: row.current_round,
    createdAt: row.created_at,
    completedAt: row.completed_at,
  };
}

function rowToRound(row: PortalRoundRow): PortalRound {
  return {
    id: row.id,
    sessionId: row.session_id,
    userId: row.user_id,
    roundNumber: row.round_number,
    question: row.question,
    userInput: row.user_input,
    aiResponse: row.ai_response,
    createdAt: row.created_at,
    completedAt: row.completed_at,
  };
}

function isSchemaError(error: { code?: string; message?: string }): boolean {
  if (!error) return false;
  if (error.code && typeof error.code === 'string') {
    const cls = error.code.substring(0, 2);
    if (cls === '42' || cls === '08') return true;
    if (cls === '23') return false;
  }
  return false;
}

export const portalService = {
  async getActiveSession(userId: string): Promise<PortalSession | null> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('portal_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .maybeSingle();

      if (error) {
        if (isSchemaError(error)) throw error;
        return null;
      }
      return data ? rowToSession(data as PortalSessionRow) : null;
    } catch (err: unknown) {
      console.error('portalService.getActiveSession error:', err);
      return null;
    }
  },

  async createSession(userId: string, node: UserNode): Promise<PortalSession | null> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('portal_sessions')
        .insert({ user_id: userId, node, status: 'active', current_round: 1 })
        .select()
        .single();

      if (error) {
        if (isSchemaError(error)) throw error;
        return null;
      }
      return rowToSession(data as PortalSessionRow);
    } catch (err: unknown) {
      console.error('portalService.createSession error:', err);
      return null;
    }
  },

  async saveRound(params: {
    sessionId: string;
    userId: string;
    roundNumber: number;
    question: string;
    userInput: string;
    aiResponse: string;
  }): Promise<PortalRound | null> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('portal_rounds')
        .insert({
          session_id: params.sessionId,
          user_id: params.userId,
          round_number: params.roundNumber,
          question: params.question,
          user_input: params.userInput,
          ai_response: params.aiResponse,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        if (isSchemaError(error)) throw error;
        return null;
      }
      return rowToRound(data as PortalRoundRow);
    } catch (err: unknown) {
      console.error('portalService.saveRound error:', err);
      return null;
    }
  },

  async completeSession(sessionId: string): Promise<void> {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from('portal_sessions')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', sessionId);

      if (error && isSchemaError(error)) throw error;
    } catch (err: unknown) {
      console.error('portalService.completeSession error:', err);
    }
  },

  async updateCurrentRound(sessionId: string, round: number): Promise<void> {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from('portal_sessions')
        .update({ current_round: round })
        .eq('id', sessionId);

      if (error && isSchemaError(error)) throw error;
    } catch (err: unknown) {
      console.error('portalService.updateCurrentRound error:', err);
    }
  },
};
