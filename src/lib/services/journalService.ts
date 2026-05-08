'use client';

import { createClient } from '@/lib/supabase/client';
import type {
  JournalEntry,
  JournalEntryRow,
  UserNode,
} from '@/lib/supabase/types';

function rowToEntry(row: JournalEntryRow): JournalEntry {
  return {
    id: row.id,
    userId: row.user_id,
    content: row.content,
    wordCount: row.word_count,
    node: row.node,
    depthScore: row.depth_score,
    emotionTags: row.emotion_tags ?? [],
    mirroringResponse: row.mirroring_response,
    crisisFlag: row.crisis_flag,
    detectedLanguage: row.detected_language,
    shadowTopics: row.shadow_topics ?? [],
    archetypeHint: row.archetype_hint,
    recommendUpsell: row.recommend_upsell,
    upsellProduct: row.upsell_product,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function isSchemaError(error: { code?: string; message?: string }): boolean {
  if (!error) return false;
  if (error.code && typeof error.code === 'string') {
    const cls = error.code.substring(0, 2);
    if (cls === '42' || cls === '08') return true;
    if (cls === '23') return false;
  }
  if (error.message) {
    const patterns = [
      /relation.*does not exist/i,
      /column.*does not exist/i,
      /function.*does not exist/i,
      /syntax error/i,
    ];
    return patterns.some((p) => p.test(error.message!));
  }
  return false;
}

export const journalService = {
  async getAll(userId: string): Promise<JournalEntry[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }
      return (data as JournalEntryRow[]).map(rowToEntry);
    } catch (err: unknown) {
      console.error('journalService.getAll error:', err);
      throw err;
    }
  },

  async create(params: {
    userId: string;
    content: string;
    wordCount: number;
    node: UserNode;
    depthScore: number;
    emotionTags: string[];
    mirroringResponse: string;
    crisisFlag: boolean;
    detectedLanguage: string;
    shadowTopics: string[];
    archetypeHint: string | null;
    recommendUpsell: boolean;
    upsellProduct: string | null;
  }): Promise<JournalEntry | null> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: params.userId,
          content: params.content,
          word_count: params.wordCount,
          node: params.node,
          depth_score: params.depthScore,
          emotion_tags: params.emotionTags,
          mirroring_response: params.mirroringResponse,
          crisis_flag: params.crisisFlag,
          detected_language: params.detectedLanguage,
          shadow_topics: params.shadowTopics,
          archetype_hint: params.archetypeHint,
          recommend_upsell: params.recommendUpsell,
          upsell_product: params.upsellProduct,
        })
        .select()
        .single();

      if (error) {
        if (isSchemaError(error)) throw error;
        return null;
      }

      const entry = rowToEntry(data as JournalEntryRow);

      // Fire crisis alert email if crisis_flag is set
      if (params.crisisFlag) {
        try {
          await supabase.functions.invoke('send-crisis-alert', {
            body: {
              userEmail: '',   // populated server-side from user_profiles
              userNickname: '',
              node: params.node,
              detectedLanguage: params.detectedLanguage,
              entryId: entry.id,
              journalEntryCreatedAt: entry.createdAt,
            },
          });
        } catch {
          // Non-blocking — journal entry already saved
          console.warn('Crisis alert email could not be sent, but entry was saved.');
        }
      }

      return entry;
    } catch (err: unknown) {
      console.error('journalService.create error:', err);
      throw err;
    }
  },
};
