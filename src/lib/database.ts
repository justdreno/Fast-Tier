const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface TierDefinition {
  id: string;
  code: string;
  name: string;
  tier_type: 'HT' | 'LT';
  tier_level: number;
  points_value: number;
  color_hex: string;
  created_at: string;
}

export interface RankDefinition {
  id: string;
  code: string;
  name: string;
  min_points: number;
  max_points: number | null;
  color_hex: string;
  icon_name: string;
  description: string;
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

export interface Partner {
  id: string;
  name: string;
  server_ip: string;
  website_url: string;
  description: string;
  icon_url?: string;
  banner_url?: string;
  player_count?: number;
  tags?: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const url = `${API_URL}${endpoint}`;
  console.log('Fetching:', url);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  console.log('Response status:', response.status);
  console.log('Content-Type:', response.headers.get('content-type'));
  console.log('Response URL:', response.url);

  if (!response.ok) {
    const text = await response.text();
    console.error('API Error Response:', text.substring(0, 200));
    let error;
    try {
      error = JSON.parse(text);
    } catch {
      error = { error: `HTTP ${response.status}: ${text.substring(0, 100)}` };
    }
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  const text = await response.text();
  console.log('Response body preview:', text.substring(0, 100));
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('JSON parse error. Full response:', text);
    throw new Error('Invalid JSON response from server');
  }
}

export async function getPlayers(): Promise<Player[]> {
  return fetchAPI('/players');
}

export async function searchPlayers(query: string): Promise<Player[]> {
  return fetchAPI(`/players/search?q=${encodeURIComponent(query)}`);
}

export async function getPlayerById(id: string): Promise<Player | null> {
  return fetchAPI(`/players/${id}`);
}

export async function getPlayerByUsername(username: string): Promise<Player | null> {
  const players = await searchPlayers(username);
  return players.find(p => p.username.toLowerCase() === username.toLowerCase()) || null;
}

export async function addPlayer(player: Omit<Player, 'id' | 'uid' | 'created_at' | 'updated_at'>): Promise<Player> {
  return fetchAPI('/players', {
    method: 'POST',
    body: JSON.stringify(player),
  });
}

export async function updatePlayer(id: string, updates: Partial<Player>): Promise<void> {
  return fetchAPI(`/players/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function deletePlayer(id: string): Promise<void> {
  return fetchAPI(`/players/${id}`, {
    method: 'DELETE',
  });
}

export async function getGamemodes(): Promise<Gamemode[]> {
  return fetchAPI('/gamemodes');
}

export async function getGamemodeByCode(code: string): Promise<Gamemode | null> {
  return fetchAPI(`/gamemodes/${code}`);
}

export async function getGamemodeById(id: string): Promise<Gamemode | null> {
  const gamemodes = await getGamemodes();
  return gamemodes.find(g => g.id === id) || null;
}

export async function getTierDefinitions(): Promise<TierDefinition[]> {
  return fetchAPI('/tier-definitions');
}

export async function getAchievements(): Promise<Achievement[]> {
  return fetchAPI('/achievements');
}

export async function getApplications(): Promise<Application[]> {
  return fetchAPI('/applications');
}

export async function getApplicationByDiscordId(discordUserId: string): Promise<Application | null> {
  return fetchAPI(`/applications/discord/${discordUserId}`);
}

export async function createApplication(applicationData: {
  username: string;
  discord_username: string;
  discord_user_id: string;
  email: string;
  region: string;
  gamemode_id: string;
}): Promise<Application> {
  return fetchAPI('/applications', {
    method: 'POST',
    body: JSON.stringify(applicationData),
  });
}

export async function getPartners(): Promise<Partner[]> {
  return fetchAPI('/partners');
}

export async function getPartnerById(id: string): Promise<Partner | null> {
  return fetchAPI(`/partners/${id}`);
}

export async function addPartner(partner: Omit<Partner, 'id' | 'created_at' | 'updated_at'>): Promise<Partner> {
  return fetchAPI('/partners', {
    method: 'POST',
    body: JSON.stringify(partner),
  });
}

export async function updatePartner(id: string, updates: Partial<Partner>): Promise<void> {
  return fetchAPI(`/partners/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function deletePartner(id: string): Promise<void> {
  return fetchAPI(`/partners/${id}`, {
    method: 'DELETE',
  });
}

export async function healthCheck(): Promise<{ status: string; timestamp: string }> {
  return fetchAPI('/health');
}

export const supabase = null;
