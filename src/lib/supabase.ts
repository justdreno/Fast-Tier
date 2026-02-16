import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' && 
  supabaseAnonKey !== 'your-anon-key-here');

// Create client only if configured
export const supabase: SupabaseClient | null = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Mock data fallback
const mockPlayers = [
  {
    id: '1',
    uid: 'FT-00291',
    username: 'Marlowww',
    rank: 'Combat Grandmaster',
    points: 435,
    region: 'NA',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    avatar_url: undefined,
    tiers: [
      { id: 't1', player_id: '1', gamemode_id: 'g1', tier_definition_id: 'td1', achieved_at: new Date().toISOString(), gamemode: { id: 'g1', code: 'vanilla', name: 'Vanilla', display_name: 'Vanilla', description: 'Classic PvP', icon_name: 'Heart', color_hex: '#ef4444', is_active: true, sort_order: 1, created_at: new Date().toISOString() }, tier_definition: { id: 'td1', code: 'HT1', name: 'High Tier 1', tier_type: 'HT', tier_level: 1, min_points: 400, max_points: 500, color_hex: '#10b981', created_at: new Date().toISOString() } },
      { id: 't2', player_id: '1', gamemode_id: 'g2', tier_definition_id: 'td1', achieved_at: new Date().toISOString(), gamemode: { id: 'g2', code: 'uhc', name: 'UHC', display_name: 'UHC', description: 'Ultra Hardcore', icon_name: 'Heart', color_hex: '#dc2626', is_active: true, sort_order: 2, created_at: new Date().toISOString() }, tier_definition: { id: 'td1', code: 'HT1', name: 'High Tier 1', tier_type: 'HT', tier_level: 1, min_points: 400, max_points: 500, color_hex: '#10b981', created_at: new Date().toISOString() } },
      { id: 't3', player_id: '1', gamemode_id: 'g3', tier_definition_id: 'td4', achieved_at: new Date().toISOString(), gamemode: { id: 'g3', code: 'pot', name: 'Pot', display_name: 'Pot', description: 'Potion PvP', icon_name: 'Flame', color_hex: '#f97316', is_active: true, sort_order: 3, created_at: new Date().toISOString() }, tier_definition: { id: 'td4', code: 'LT1', name: 'Low Tier 1', tier_type: 'LT', tier_level: 1, min_points: 150, max_points: 199, color_hex: '#3b82f6', created_at: new Date().toISOString() } },
      { id: 't4', player_id: '1', gamemode_id: 'g6', tier_definition_id: 'td4', achieved_at: new Date().toISOString(), gamemode: { id: 'g6', code: 'sword', name: 'Sword', display_name: 'Sword', description: 'Sword Combat', icon_name: 'Sword', color_hex: '#3b82f6', is_active: true, sort_order: 6, created_at: new Date().toISOString() }, tier_definition: { id: 'td4', code: 'LT1', name: 'Low Tier 1', tier_type: 'LT', tier_level: 1, min_points: 150, max_points: 199, color_hex: '#3b82f6', created_at: new Date().toISOString() } },
      { id: 't5', player_id: '1', gamemode_id: 'g7', tier_definition_id: 'td1', achieved_at: new Date().toISOString(), gamemode: { id: 'g7', code: 'axe', name: 'Axe', display_name: 'Axe', description: 'Axe Combat', icon_name: 'Axe', color_hex: '#8b5cf6', is_active: true, sort_order: 7, created_at: new Date().toISOString() }, tier_definition: { id: 'td1', code: 'HT1', name: 'High Tier 1', tier_type: 'HT', tier_level: 1, min_points: 400, max_points: 500, color_hex: '#10b981', created_at: new Date().toISOString() } },
      { id: 't6', player_id: '1', gamemode_id: 'g8', tier_definition_id: 'td1', achieved_at: new Date().toISOString(), gamemode: { id: 'g8', code: 'mace', name: 'Mace', display_name: 'Mace', description: 'Mace Combat', icon_name: 'Hammer', color_hex: '#a855f7', is_active: true, sort_order: 8, created_at: new Date().toISOString() }, tier_definition: { id: 'td1', code: 'HT1', name: 'High Tier 1', tier_type: 'HT', tier_level: 1, min_points: 400, max_points: 500, color_hex: '#10b981', created_at: new Date().toISOString() } },
      { id: 't7', player_id: '1', gamemode_id: 'g4', tier_definition_id: 'td4', achieved_at: new Date().toISOString(), gamemode: { id: 'g4', code: 'nethop', name: 'NethOP', display_name: 'NethOP', description: 'Nether OP', icon_name: 'Flame', color_hex: '#ea580c', is_active: true, sort_order: 4, created_at: new Date().toISOString() }, tier_definition: { id: 'td4', code: 'LT1', name: 'Low Tier 1', tier_type: 'LT', tier_level: 1, min_points: 250, max_points: 299, color_hex: '#3b82f6', created_at: new Date().toISOString() } },
      { id: 't8', player_id: '1', gamemode_id: 'g5', tier_definition_id: 'td5', achieved_at: new Date().toISOString(), gamemode: { id: 'g5', code: 'smp', name: 'SMP', display_name: 'SMP', description: 'Survival Multiplayer', icon_name: 'Users', color_hex: '#22c55e', is_active: true, sort_order: 5, created_at: new Date().toISOString() }, tier_definition: { id: 'td5', code: 'LT2', name: 'Low Tier 2', tier_type: 'LT', tier_level: 2, min_points: 200, max_points: 249, color_hex: '#06b6d4', created_at: new Date().toISOString() } },
    ],
    achievements: []
  },
  {
    id: '2',
    uid: 'FT-00184',
    username: 'ItzRealMe',
    rank: 'Combat Master',
    points: 330,
    region: 'NA',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    avatar_url: undefined,
    tiers: [
      { id: 't9', player_id: '2', gamemode_id: 'g6', tier_definition_id: 'td3', achieved_at: new Date().toISOString(), gamemode: { id: 'g6', code: 'sword', name: 'Sword', display_name: 'Sword', description: 'Sword Combat', icon_name: 'Sword', color_hex: '#3b82f6', is_active: true, sort_order: 6, created_at: new Date().toISOString() }, tier_definition: { id: 'td3', code: 'HT3', name: 'High Tier 3', tier_type: 'HT', tier_level: 3, min_points: 300, max_points: 349, color_hex: '#ff9f43', created_at: new Date().toISOString() } },
      { id: 't10', player_id: '2', gamemode_id: 'g1', tier_definition_id: 'td1', achieved_at: new Date().toISOString(), gamemode: { id: 'g1', code: 'vanilla', name: 'Vanilla', display_name: 'Vanilla', description: 'Classic PvP', icon_name: 'Heart', color_hex: '#ef4444', is_active: true, sort_order: 1, created_at: new Date().toISOString() }, tier_definition: { id: 'td1', code: 'HT1', name: 'High Tier 1', tier_type: 'HT', tier_level: 1, min_points: 400, max_points: 500, color_hex: '#10b981', created_at: new Date().toISOString() } },
      { id: 't11', player_id: '2', gamemode_id: 'g3', tier_definition_id: 'td1', achieved_at: new Date().toISOString(), gamemode: { id: 'g3', code: 'pot', name: 'Pot', display_name: 'Pot', description: 'Potion PvP', icon_name: 'Flame', color_hex: '#f97316', is_active: true, sort_order: 3, created_at: new Date().toISOString() }, tier_definition: { id: 'td1', code: 'HT1', name: 'High Tier 1', tier_type: 'HT', tier_level: 1, min_points: 400, max_points: 500, color_hex: '#10b981', created_at: new Date().toISOString() } },
      { id: 't12', player_id: '2', gamemode_id: 'g2', tier_definition_id: 'td1', achieved_at: new Date().toISOString(), gamemode: { id: 'g2', code: 'uhc', name: 'UHC', display_name: 'UHC', description: 'Ultra Hardcore', icon_name: 'Heart', color_hex: '#dc2626', is_active: true, sort_order: 2, created_at: new Date().toISOString() }, tier_definition: { id: 'td1', code: 'HT1', name: 'High Tier 1', tier_type: 'HT', tier_level: 1, min_points: 400, max_points: 500, color_hex: '#10b981', created_at: new Date().toISOString() } },
      { id: 't13', player_id: '2', gamemode_id: 'g7', tier_definition_id: 'td1', achieved_at: new Date().toISOString(), gamemode: { id: 'g7', code: 'axe', name: 'Axe', display_name: 'Axe', description: 'Axe Combat', icon_name: 'Axe', color_hex: '#8b5cf6', is_active: true, sort_order: 7, created_at: new Date().toISOString() }, tier_definition: { id: 'td1', code: 'HT1', name: 'High Tier 1', tier_type: 'HT', tier_level: 1, min_points: 400, max_points: 500, color_hex: '#10b981', created_at: new Date().toISOString() } },
      { id: 't14', player_id: '2', gamemode_id: 'g8', tier_definition_id: 'td5', achieved_at: new Date().toISOString(), gamemode: { id: 'g8', code: 'mace', name: 'Mace', display_name: 'Mace', description: 'Mace Combat', icon_name: 'Hammer', color_hex: '#a855f7', is_active: true, sort_order: 8, created_at: new Date().toISOString() }, tier_definition: { id: 'td5', code: 'LT2', name: 'Low Tier 2', tier_type: 'LT', tier_level: 2, min_points: 200, max_points: 249, color_hex: '#06b6d4', created_at: new Date().toISOString() } },
      { id: 't15', player_id: '2', gamemode_id: 'g4', tier_definition_id: 'td5', achieved_at: new Date().toISOString(), gamemode: { id: 'g4', code: 'nethop', name: 'NethOP', display_name: 'NethOP', description: 'Nether OP', icon_name: 'Flame', color_hex: '#ea580c', is_active: true, sort_order: 4, created_at: new Date().toISOString() }, tier_definition: { id: 'td5', code: 'LT2', name: 'Low Tier 2', tier_type: 'LT', tier_level: 2, min_points: 200, max_points: 249, color_hex: '#06b6d4', created_at: new Date().toISOString() } },
      { id: 't16', player_id: '2', gamemode_id: 'g5', tier_definition_id: 'td5', achieved_at: new Date().toISOString(), gamemode: { id: 'g5', code: 'smp', name: 'SMP', display_name: 'SMP', description: 'Survival Multiplayer', icon_name: 'Users', color_hex: '#22c55e', is_active: true, sort_order: 5, created_at: new Date().toISOString() }, tier_definition: { id: 'td5', code: 'LT2', name: 'Low Tier 2', tier_type: 'LT', tier_level: 2, min_points: 200, max_points: 249, color_hex: '#06b6d4', created_at: new Date().toISOString() } },
    ],
    achievements: []
  },
  {
    id: '3',
    uid: 'FT-00327',
    username: 'Swight',
    rank: 'Combat Master',
    points: 290,
    region: 'NA',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    avatar_url: undefined,
    tiers: [
      { id: 't17', player_id: '3', gamemode_id: 'g1', tier_definition_id: 'td1', achieved_at: new Date().toISOString(), gamemode: { id: 'g1', code: 'vanilla', name: 'Vanilla', display_name: 'Vanilla', description: 'Classic PvP', icon_name: 'Heart', color_hex: '#ef4444', is_active: true, sort_order: 1, created_at: new Date().toISOString() }, tier_definition: { id: 'td1', code: 'HT1', name: 'High Tier 1', tier_type: 'HT', tier_level: 1, min_points: 400, max_points: 500, color_hex: '#10b981', created_at: new Date().toISOString() } },
      { id: 't18', player_id: '3', gamemode_id: 'g6', tier_definition_id: 'td1', achieved_at: new Date().toISOString(), gamemode: { id: 'g6', code: 'sword', name: 'Sword', display_name: 'Sword', description: 'Sword Combat', icon_name: 'Sword', color_hex: '#3b82f6', is_active: true, sort_order: 6, created_at: new Date().toISOString() }, tier_definition: { id: 'td1', code: 'HT1', name: 'High Tier 1', tier_type: 'HT', tier_level: 1, min_points: 400, max_points: 500, color_hex: '#10b981', created_at: new Date().toISOString() } },
      { id: 't19', player_id: '3', gamemode_id: 'g3', tier_definition_id: 'td2', achieved_at: new Date().toISOString(), gamemode: { id: 'g3', code: 'pot', name: 'Pot', display_name: 'Pot', description: 'Potion PvP', icon_name: 'Flame', color_hex: '#f97316', is_active: true, sort_order: 3, created_at: new Date().toISOString() }, tier_definition: { id: 'td2', code: 'HT2', name: 'High Tier 2', tier_type: 'HT', tier_level: 2, min_points: 350, max_points: 399, color_hex: '#8b5cf6', created_at: new Date().toISOString() } },
      { id: 't20', player_id: '3', gamemode_id: 'g4', tier_definition_id: 'td5', achieved_at: new Date().toISOString(), gamemode: { id: 'g4', code: 'nethop', name: 'NethOP', display_name: 'NethOP', description: 'Nether OP', icon_name: 'Flame', color_hex: '#ea580c', is_active: true, sort_order: 4, created_at: new Date().toISOString() }, tier_definition: { id: 'td5', code: 'LT2', name: 'Low Tier 2', tier_type: 'LT', tier_level: 2, min_points: 200, max_points: 249, color_hex: '#06b6d4', created_at: new Date().toISOString() } },
      { id: 't21', player_id: '3', gamemode_id: 'g7', tier_definition_id: 'td3', achieved_at: new Date().toISOString(), gamemode: { id: 'g7', code: 'axe', name: 'Axe', display_name: 'Axe', description: 'Axe Combat', icon_name: 'Axe', color_hex: '#8b5cf6', is_active: true, sort_order: 7, created_at: new Date().toISOString() }, tier_definition: { id: 'td3', code: 'HT3', name: 'High Tier 3', tier_type: 'HT', tier_level: 3, min_points: 300, max_points: 349, color_hex: '#ff9f43', created_at: new Date().toISOString() } },
      { id: 't22', player_id: '3', gamemode_id: 'g8', tier_definition_id: 'td3', achieved_at: new Date().toISOString(), gamemode: { id: 'g8', code: 'mace', name: 'Mace', display_name: 'Mace', description: 'Mace Combat', icon_name: 'Hammer', color_hex: '#a855f7', is_active: true, sort_order: 8, created_at: new Date().toISOString() }, tier_definition: { id: 'td3', code: 'HT3', name: 'High Tier 3', tier_type: 'HT', tier_level: 3, min_points: 300, max_points: 349, color_hex: '#ff9f43', created_at: new Date().toISOString() } },
      { id: 't23', player_id: '3', gamemode_id: 'g2', tier_definition_id: 'td1', achieved_at: new Date().toISOString(), gamemode: { id: 'g2', code: 'uhc', name: 'UHC', display_name: 'UHC', description: 'Ultra Hardcore', icon_name: 'Heart', color_hex: '#dc2626', is_active: true, sort_order: 2, created_at: new Date().toISOString() }, tier_definition: { id: 'td1', code: 'HT1', name: 'High Tier 1', tier_type: 'HT', tier_level: 1, min_points: 400, max_points: 500, color_hex: '#10b981', created_at: new Date().toISOString() } },
      { id: 't24', player_id: '3', gamemode_id: 'g5', tier_definition_id: 'td5', achieved_at: new Date().toISOString(), gamemode: { id: 'g5', code: 'smp', name: 'SMP', display_name: 'SMP', description: 'Survival Multiplayer', icon_name: 'Users', color_hex: '#22c55e', is_active: true, sort_order: 5, created_at: new Date().toISOString() }, tier_definition: { id: 'td5', code: 'LT2', name: 'Low Tier 2', tier_type: 'LT', tier_level: 2, min_points: 200, max_points: 249, color_hex: '#06b6d4', created_at: new Date().toISOString() } },
    ],
    achievements: []
  }
];

const mockGamemodes = [
  { id: 'g1', code: 'vanilla', name: 'Vanilla', display_name: 'Vanilla', description: 'Classic PvP', icon_name: 'Heart', color_hex: '#ef4444', is_active: true, sort_order: 1, created_at: new Date().toISOString() },
  { id: 'g2', code: 'uhc', name: 'UHC', display_name: 'UHC', description: 'Ultra Hardcore', icon_name: 'Heart', color_hex: '#dc2626', is_active: true, sort_order: 2, created_at: new Date().toISOString() },
  { id: 'g3', code: 'pot', name: 'Pot', display_name: 'Pot', description: 'Potion PvP', icon_name: 'Flame', color_hex: '#f97316', is_active: true, sort_order: 3, created_at: new Date().toISOString() },
  { id: 'g4', code: 'nethop', name: 'NethOP', display_name: 'NethOP', description: 'Nether OP', icon_name: 'Flame', color_hex: '#ea580c', is_active: true, sort_order: 4, created_at: new Date().toISOString() },
  { id: 'g5', code: 'smp', name: 'SMP', display_name: 'SMP', description: 'Survival Multiplayer', icon_name: 'Users', color_hex: '#22c55e', is_active: true, sort_order: 5, created_at: new Date().toISOString() },
  { id: 'g6', code: 'sword', name: 'Sword', display_name: 'Sword', description: 'Sword Combat', icon_name: 'Sword', color_hex: '#3b82f6', is_active: true, sort_order: 6, created_at: new Date().toISOString() },
  { id: 'g7', code: 'axe', name: 'Axe', display_name: 'Axe', description: 'Axe Combat', icon_name: 'Axe', color_hex: '#8b5cf6', is_active: true, sort_order: 7, created_at: new Date().toISOString() },
  { id: 'g8', code: 'mace', name: 'Mace', display_name: 'Mace', description: 'Mace Combat', icon_name: 'Hammer', color_hex: '#a855f7', is_active: true, sort_order: 8, created_at: new Date().toISOString() },
  { id: 'g9', code: 'ltms', name: 'LTMs', display_name: 'LTMs', description: 'Limited Time Modes', icon_name: 'Swords', color_hex: '#ec4899', is_active: true, sort_order: 9, created_at: new Date().toISOString() },
];

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
  last_tier_update?: string;
  tiers?: PlayerTier[];
  achievements?: PlayerAchievement[];
}

// API Functions - Tier Definitions
export async function getTierDefinitions(): Promise<TierDefinition[]> {
  if (!supabase) return [];
  
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
  if (!supabase) {
    console.log('Using mock gamemodes - Supabase not configured');
    return mockGamemodes;
  }
  
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
  if (!supabase) return [];
  
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
  if (!supabase) {
    console.log('Using mock players - Supabase not configured');
    return mockPlayers;
  }
  
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
  if (!supabase) {
    console.log('Using mock search - Supabase not configured');
    return mockPlayers.filter(p => 
      p.username.toLowerCase().includes(query.toLowerCase())
    );
  }
  
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
  if (!supabase) {
    return mockPlayers.find(p => p.id === id) || null;
  }
  
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
  if (!supabase) {
    return mockPlayers.find(p => 
      p.username.toLowerCase() === username.toLowerCase()
    ) || null;
  }
  
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

// Application Types
export interface Application {
  id: string;
  username: string;
  discord_username: string;
  discord_user_id: string;
  email: string;
  region: string;
  gamemode_id?: string;
  status: 'pending' | 'invited' | 'testing' | 'completed' | 'expired' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// Application Functions
export async function createApplication(applicationData: {
  username: string;
  discord_username: string;
  discord_user_id: string;
  email: string;
  region: string;
  gamemode_id: string;
}): Promise<Application> {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  // Debug: Log the data being sent
  console.log('createApplication called with:', applicationData);
  
  const { data, error } = await supabase
    .from('applications')
    .insert([applicationData])
    .select()
    .single();

  if (error) {
    console.error('Error creating application:', error);
    throw error;
  }

  return data;
}

export async function getApplicationByDiscordId(discordUserId: string): Promise<Application | null> {
  if (!supabase) {
    return null;
  }
  
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('discord_user_id', discordUserId)
    .in('status', ['pending', 'invited', 'testing'])
    .single();

  if (error) return null;
  return data;
}

export async function getGamemodeByCode(code: string): Promise<Gamemode | null> {
  if (!supabase) {
    return mockGamemodes.find(g => g.code === code) || null;
  }
  
  const { data, error } = await supabase
    .from('gamemodes')
    .select('*')
    .eq('code', code)
    .eq('is_active', true)
    .single();

  if (error) return null;
  return data;
}
