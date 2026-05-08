export type UserNode = 'rtanj' | 'sedona' | 'kailash' | 'shasta' | 'glastonbury' | 'machu_picchu' | 'esvedra';
export type UserRole = 'user' | 'admin';
export type StarMagnitude = 'iskra' | 'svetlost' | 'svemir';
export type PortalStatus = 'active' | 'completed';
export type PurchaseProduct = 'light' | 'deep_insight' | 'companion';

export interface UserProfile {
  id: string;
  email: string;
  nickname: string | null;
  assignedNode: UserNode;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  wordCount: number;
  node: UserNode;
  depthScore: number;
  emotionTags: string[];
  mirroringResponse: string | null;
  crisisFlag: boolean;
  detectedLanguage: string;
  shadowTopics: string[];
  archetypeHint: string | null;
  recommendUpsell: boolean;
  upsellProduct: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Light {
  id: string;
  userId: string | null;
  nodeId: UserNode;
  fragment: string | null;
  starMagnitude: StarMagnitude;
  isFounding: boolean;
  isBuilder: boolean;
  pulseSpeed: string;
  mapX: number;
  mapY: number;
  isAnonymous: boolean;
  createdAt: string;
  goldExpiresAt?: string | null;
}

export interface PortalSession {
  id: string;
  userId: string;
  node: UserNode;
  status: PortalStatus;
  currentRound: number;
  createdAt: string;
  completedAt: string | null;
}

export interface PortalRound {
  id: string;
  sessionId: string;
  userId: string;
  roundNumber: number;
  question: string;
  userInput: string | null;
  aiResponse: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface Purchase {
  id: string;
  userId: string;
  product: PurchaseProduct;
  amountCents: number;
  stripePaymentIntent: string | null;
  lightId: string | null;
  createdAt: string;
}

// DB row types (snake_case)
export interface UserProfileRow {
  id: string;
  email: string;
  nickname: string | null;
  assigned_node: UserNode;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface JournalEntryRow {
  id: string;
  user_id: string;
  content: string;
  word_count: number;
  node: UserNode;
  depth_score: number;
  emotion_tags: string[];
  mirroring_response: string | null;
  crisis_flag: boolean;
  detected_language: string;
  shadow_topics: string[];
  archetype_hint: string | null;
  recommend_upsell: boolean;
  upsell_product: string | null;
  created_at: string;
  updated_at: string;
}

export interface LightRow {
  id: string;
  user_id: string | null;
  node_id: UserNode;
  fragment: string | null;
  star_magnitude: StarMagnitude;
  is_founding: boolean;
  is_builder: boolean;
  pulse_speed: string;
  map_x: number;
  map_y: number;
  is_anonymous: boolean;
  created_at: string;
}

export interface PortalSessionRow {
  id: string;
  user_id: string;
  node: UserNode;
  status: PortalStatus;
  current_round: number;
  created_at: string;
  completed_at: string | null;
}

export interface PortalRoundRow {
  id: string;
  session_id: string;
  user_id: string;
  round_number: number;
  question: string;
  user_input: string | null;
  ai_response: string | null;
  created_at: string;
  completed_at: string | null;
}
