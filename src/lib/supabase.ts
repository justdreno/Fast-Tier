import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface TierDefinition {
  id: string;
  code: string;
  name: string;
  tier_type: 'HT' | 'LT';
  tier_level: number;
  min_points: number;
  max_points: number;
  color_hex: string;
  created_at: string;
}

export interface Gamemode {
  id: string;
  code: string;
  name: string;
  display_name: string;
  description: string;
  icon_name: string;
  color_hex: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  icon_name: string;
  color_hex: string;
  points_bonus: number;
  created_at: string;
}

export interface PlayerTier {
  id: string;
  player_id: string;
  gamemode_id: string;
  tier_definition_id: string;
  achieved_at: string;
  tier_definition?: TierDefinition;
  gamemode?: Gamemode;
}

export interface PlayerAchievement {
  id: string;
  player_id: string;
  achievement_id: string;
  achieved_at: string;
  achievement?: Achievement;
}

export interface Player {
  id: string;
  uid: string;
  username: string;
  rank: string;
  points: number;
  region: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  tiers?: PlayerTier[];
  achievements?: PlayerAchievement[];
}

// API Functions - Tier Definitions
export async function getTierDefinitions(): Promise<TierDefinition[]> {
  const { data, error } = await supabase
    .from('tier_definitions')
    .select('*')
    .order('tier_type', { ascending: false })
    .order('tier_level', { ascending: true });

  if (error) {
    console.error('Error fetching tier definitions:', error);
    throw error;
  }

  return data || [];
}

// API Functions - Gamemodes
export async function getGamemodes(): Promise<Gamemode[]> {
  const { data, error } = await supabase
    .from('gamemodes')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching gamemodes:', error);
    throw error;
  }

  return data || [];
}

// API Functions - Achievements
export async function getAchievements(): Promise<Achievement[]> {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('points_bonus', { ascending: false });

  if (error) {
    console.error('Error fetching achievements:', error);
    throw error;
  }

  return data || [];
}

// API Functions - Players
export async function getPlayers(): Promise<Player[]> {
  const { data, error } = await supabase
    .from('players')
    .select(`
      *,
      tiers:player_tiers(
        *,
        tier_definition:tier_definitions(*),
        gamemode:gamemodes(*)
      ),
      achievements:player_achievements(
        *,
        achievement:achievements(*)
      )
    `)
    .eq('is_active', true)
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
      tiers:player_tiers(
        *,
        tier_definition:tier_definitions(*),
        gamemode:gamemodes(*)
      ),
      achievements:player_achievements(
        *,
        achievement:achievements(*)
      )
    `)
    .eq('is_active', true)
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
      tiers:player_tiers(
        *,
        tier_definition:tier_definitions(*),
        gamemode:gamemodes(*)
      ),
      achievements:player_achievements(
        *,
        achievement:achievements(*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching player:', error);
    throw error;
  }

  return data;
}

export async function getPlayerByUsername(username: string): Promise<Player | null> {
  const { data, error } = await supabase
    .from('players')
    .select(`
      *,
      tiers:player_tiers(
        *,
        tier_definition:tier_definitions(*),
        gamemode:gamemodes(*)
      ),
      achievements:player_achievements(
        *,
        achievement:achievements(*)
      )
    `)
    .eq('is_active', true)
    .ilike('username', username)
    .single();

  if (error) {
    console.error('Error fetching player by username:', error);
    throw error;
  }

  return data;
}
