import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Player {
  id: string;
  uid: string;
  username: string;
  rank: string;
  points: number;
  region: string;
  created_at: string;
  updated_at: string;
  tiers?: Tier[];
}

export interface Tier {
  id: string;
  player_id: string;
  gamemode: string;
  tier: string;
  created_at: string;
}

// API Functions
export async function getPlayers(): Promise<Player[]> {
  const { data, error } = await supabase
    .from('players')
    .select(`
      *,
      tiers (*)
    `)
    .order('points', { ascending: false });

  if (error) {
    console.error('Error fetching players:', error);
    throw error;
  }

  return data || [];
}

export async function searchPlayers(query: string): Promise<Player[]> {
  const { data, error } = await supabase
    .from('players')
    .select(`
      *,
      tiers (*)
    `)
    .ilike('username', `%${query}%`)
    .order('points', { ascending: false });

  if (error) {
    console.error('Error searching players:', error);
    throw error;
  }

  return data || [];
}

export async function getPlayerById(id: string): Promise<Player | null> {
  const { data, error } = await supabase
    .from('players')
    .select(`
      *,
      tiers (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching player:', error);
    throw error;
  }

  return data;
}
