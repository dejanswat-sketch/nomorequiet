'use client';

import { createClient } from '@/lib/supabase/client';
import type { Light, LightRow, UserNode, StarMagnitude } from '@/lib/supabase/types';

function rowToLight(row: LightRow): Light {
  return {
    id: row.id,
    userId: row.user_id,
    nodeId: row.node_id,
    fragment: row.fragment,
    starMagnitude: row.star_magnitude,
    isFounding: row.is_founding,
    isBuilder: row.is_builder,
    pulseSpeed: row.pulse_speed,
    mapX: row.map_x,
    mapY: row.map_y,
    isAnonymous: row.is_anonymous,
    createdAt: row.created_at,
    goldExpiresAt: (row as Record<string, unknown>).gold_expires_at as string | null ?? null,
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

export const lightService = {
  async getAll(): Promise<Light[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('lights')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }
      return (data as LightRow[]).map(rowToLight);
    } catch (err: unknown) {
      console.error('lightService.getAll error:', err);
      return [];
    }
  },

  async create(params: {
    userId: string;
    nodeId: UserNode;
    fragment: string;
    starMagnitude: StarMagnitude;
    mapX: number;
    mapY: number;
  }): Promise<Light | null> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('lights')
        .insert({
          user_id: params.userId,
          node_id: params.nodeId,
          fragment: params.fragment,
          star_magnitude: params.starMagnitude,
          map_x: params.mapX,
          map_y: params.mapY,
          is_anonymous: false,
        })
        .select()
        .single();

      if (error) {
        if (isSchemaError(error)) throw error;
        return null;
      }
      return rowToLight(data as LightRow);
    } catch (err: unknown) {
      console.error('lightService.create error:', err);
      return null;
    }
  },

  subscribeToAll(onUpdate: (lights: Light[]) => void) {
    const supabase = createClient();
    const channel = supabase
      .channel('lights_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'lights' },
        async () => {
          const lights = await lightService.getAll();
          onUpdate(lights);
        }
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  },
};
