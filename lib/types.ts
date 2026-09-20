/**
 * Domain model for the Lumina platform.
 * These types mirror the PostgreSQL schema in `supabase/schema.sql` and are the
 * contract used by the data layer, API routes, and UI. When the real Supabase
 * backend is wired up, repository implementations will return these same shapes.
 */

export type ID = string
export type ISODate = string

/* ------------------------------- Identity ------------------------------- */

export type Role = 'owner' | 'admin' | 'manager' | 'editor' | 'analyst' | 'viewer'

export interface UserProfile {
  id: ID
  fullName: string
  email: string
  avatarUrl?: string
  title?: string
  timezone: string
  locale: 'en' | 'fa'
  createdAt: ISODate
}

export interface Organization {
  id: ID
  name: string
  slug: string
  logoUrl?: string
  plan: 'free' | 'starter' | 'growth' | 'scale'
  createdAt: ISODate
}

export interface Workspace {
  id: ID
  organizationId: ID
  name: string
  color: string
}

export interface Membership {
  id: ID
  organizationId: ID
  userId: ID
  role: Role
  user: UserProfile
  status: 'active' | 'invited' | 'suspended'
  invitedAt?: ISODate
}

/* ------------------------- Instagram integration ------------------------ */

export type IntegrationStatus = 'connected' | 'disconnected' | 'expired' | 'error'

export interface InstagramAccount {
  id: ID
  workspaceId: ID
  username: string
  displayName: string
  avatarUrl?: string
  provider: 'meta' | 'sandbox'
  status: IntegrationStatus
  followers: number
  following: number
  mediaCount: number
  connectedAt?: ISODate
}

/* -------------------------------- Content ------------------------------- */

export type ContentType = 'post' | 'reel' | 'story' | 'carousel'
export type ContentStatus =
  | 'draft'
  | 'in_review'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'failed'

export interface ContentItem {
  id: ID
  workspaceId: ID
  accountId: ID
  type: ContentType
  caption: string
  mediaIds: ID[]
  status: ContentStatus
  scheduledAt?: ISODate
  publishedAt?: ISODate
  createdBy: ID
  aiGenerated: boolean
  metrics?: ContentMetrics
  approvals?: Approval[]
}

export interface ContentMetrics {
  reach: number
  impressions: number
  likes: number
  comments: number
  shares: number
  saves: number
  engagementRate: number
}

export interface Approval {
  id: ID
  contentId: ID
  reviewerId: ID
  decision: 'pending' | 'approved' | 'rejected'
  note?: string
  decidedAt?: ISODate
}

export type MediaKind = 'image' | 'video' | 'audio'

export interface MediaAsset {
  id: ID
  workspaceId: ID
  kind: MediaKind
  url: string
  thumbnailUrl?: string
  name: string
  sizeBytes: number
  width?: number
  height?: number
  tags: string[]
  aiGenerated: boolean
  createdAt: ISODate
}

/* ----------------------------- Conversations ---------------------------- */

export type ConversationChannel = 'dm' | 'comment'

export interface Conversation {
  id: ID
  accountId: ID
  channel: ConversationChannel
  contactHandle: string
  contactAvatarUrl?: string
  lastMessage: string
  unreadCount: number
  assignedTo?: ID
  sentiment: 'positive' | 'neutral' | 'negative'
  aiHandled: boolean
  updatedAt: ISODate
}

export interface Message {
  id: ID
  conversationId: ID
  direction: 'inbound' | 'outbound'
  author: string
  body: string
  aiSuggested?: boolean
  createdAt: ISODate
}

export interface Comment {
  id: ID
  contentId: ID
  accountId: ID
  author: string
  authorAvatarUrl?: string
  body: string
  sentiment: 'positive' | 'neutral' | 'negative'
  status: 'new' | 'replied' | 'hidden'
  likes: number
  createdAt: ISODate
}

/* ---------------------------------- CRM --------------------------------- */

export type LeadStage = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'

export interface Lead {
  id: ID
  workspaceId: ID
  name: string
  handle: string
  avatarUrl?: string
  source: 'dm' | 'comment' | 'story' | 'ad' | 'manual'
  stage: LeadStage
  value: number
  ownerId?: ID
  tags: string[]
  createdAt: ISODate
  lastActivityAt: ISODate
}

export interface Customer {
  id: ID
  workspaceId: ID
  name: string
  handle: string
  email?: string
  phone?: string
  avatarUrl?: string
  lifetimeValue: number
  orderCount: number
  tags: string[]
  segment: 'vip' | 'returning' | 'new' | 'at_risk'
  createdAt: ISODate
}

/* ------------------------------- Commerce ------------------------------- */

export interface ProductCategory {
  id: ID
  name: string
  slug: string
  productCount: number
}

export interface Product {
  id: ID
  workspaceId: ID
  name: string
  sku: string
  categoryId: ID
  price: number
  currency: string
  stock: number
  imageUrl?: string
  status: 'active' | 'draft' | 'archived'
  createdAt: ISODate
}

export type OrderStatus = 'pending' | 'paid' | 'fulfilled' | 'shipped' | 'cancelled' | 'refunded'

export interface OrderLine {
  productId: ID
  name: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: ID
  workspaceId: ID
  number: string
  customerId: ID
  customerName: string
  lines: OrderLine[]
  subtotal: number
  discount: number
  total: number
  currency: string
  status: OrderStatus
  channel: 'instagram_shop' | 'dm' | 'manual'
  createdAt: ISODate
}

export interface Discount {
  id: ID
  code: string
  type: 'percentage' | 'fixed'
  value: number
  usageCount: number
  active: boolean
  expiresAt?: ISODate
}

/* ------------------------------- AI Agents ------------------------------ */

export type AgentKind =
  | 'content'
  | 'social'
  | 'sales'
  | 'support'
  | 'crm'
  | 'analytics'
  | 'recommendation'

export interface AiAgent {
  id: ID
  kind: AgentKind
  name: string
  description: string
  enabled: boolean
  autonomy: 'suggest' | 'assisted' | 'autonomous'
  model: string
  runsToday: number
  successRate: number
  lastRunAt?: ISODate
}

export interface AgentActivity {
  id: ID
  agentId: ID
  agentKind: AgentKind
  summary: string
  outcome: 'success' | 'pending' | 'failed'
  createdAt: ISODate
}

/* ---------------------------- Notifications ----------------------------- */

export interface AppNotification {
  id: ID
  title: string
  body: string
  kind: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  createdAt: ISODate
}

export interface AuditLog {
  id: ID
  actor: string
  action: string
  target: string
  ip?: string
  createdAt: ISODate
}

/* ------------------------------- Analytics ------------------------------ */

export interface TimeseriesPoint {
  date: ISODate
  value: number
}

export interface MetricSummary {
  key: string
  label: string
  value: number
  unit?: string
  changePct: number
  series: number[]
}
