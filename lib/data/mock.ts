import type {
  AgentActivity,
  AiAgent,
  AppNotification,
  AuditLog,
  Comment,
  Conversation,
  ContentItem,
  Customer,
  Discount,
  InstagramAccount,
  Lead,
  MediaAsset,
  Membership,
  Message,
  MetricSummary,
  Order,
  Organization,
  Product,
  ProductCategory,
  UserProfile,
  Workspace,
} from '@/lib/types'

/**
 * Deterministic in-memory dataset used while the Meta Graph API and Supabase
 * backend are not yet connected. All values are clearly synthetic sample data
 * (no fabricated production claims). The shapes match the real schema so the
 * repositories can be swapped for live implementations without UI changes.
 */

const now = Date.parse('2026-09-19T10:00:00.000Z')
const day = 86_400_000
const iso = (offsetDays: number, hours = 0) =>
  new Date(now - offsetDays * day + hours * 3_600_000).toISOString()

function seededSeries(seed: number, length = 14, base = 100, variance = 40): number[] {
  const out: number[] = []
  let x = seed
  for (let i = 0; i < length; i++) {
    x = (x * 9301 + 49297) % 233280
    const r = x / 233280
    out.push(Math.round(base + (r - 0.5) * variance + i * (variance / length)))
  }
  return out
}

/* ------------------------------- Identity ------------------------------- */

export const currentUser: UserProfile = {
  id: 'u_001',
  fullName: 'Ava Mercer',
  email: 'ava@lumina.app',
  avatarUrl: '/placeholder-user.jpg',
  title: 'Head of Social',
  timezone: 'UTC',
  locale: 'en',
  createdAt: iso(320),
}

export const organization: Organization = {
  id: 'org_001',
  name: 'Nova Studio',
  slug: 'nova-studio',
  plan: 'growth',
  createdAt: iso(300),
}

export const workspaces: Workspace[] = [
  { id: 'ws_001', organizationId: 'org_001', name: 'Nova Main', color: 'oklch(0.68 0.2 289)' },
  { id: 'ws_002', organizationId: 'org_001', name: 'Nova Beauty', color: 'oklch(0.7 0.18 18)' },
  { id: 'ws_003', organizationId: 'org_001', name: 'Nova Travel', color: 'oklch(0.72 0.14 205)' },
]

export const memberships: Membership[] = [
  {
    id: 'm_001',
    organizationId: 'org_001',
    userId: 'u_001',
    role: 'owner',
    status: 'active',
    user: currentUser,
  },
  {
    id: 'm_002',
    organizationId: 'org_001',
    userId: 'u_002',
    role: 'manager',
    status: 'active',
    user: {
      id: 'u_002',
      fullName: 'Leo Nakamura',
      email: 'leo@lumina.app',
      title: 'Content Lead',
      timezone: 'Asia/Tokyo',
      locale: 'en',
      createdAt: iso(210),
    },
  },
  {
    id: 'm_003',
    organizationId: 'org_001',
    userId: 'u_003',
    role: 'editor',
    status: 'active',
    user: {
      id: 'u_003',
      fullName: 'Mina Rahimi',
      email: 'mina@lumina.app',
      title: 'Designer',
      timezone: 'Asia/Tehran',
      locale: 'fa',
      createdAt: iso(120),
    },
  },
  {
    id: 'm_004',
    organizationId: 'org_001',
    userId: 'u_004',
    role: 'analyst',
    status: 'invited',
    invitedAt: iso(3),
    user: {
      id: 'u_004',
      fullName: 'Sam Okafor',
      email: 'sam@lumina.app',
      title: 'Growth Analyst',
      timezone: 'Europe/London',
      locale: 'en',
      createdAt: iso(3),
    },
  },
]

export const instagramAccounts: InstagramAccount[] = [
  {
    id: 'ig_001',
    workspaceId: 'ws_001',
    username: '@nova.studio',
    displayName: 'Nova Studio',
    provider: 'sandbox',
    status: 'connected',
    followers: 128_400,
    following: 812,
    mediaCount: 642,
    connectedAt: iso(90),
  },
  {
    id: 'ig_002',
    workspaceId: 'ws_002',
    username: '@nova.beauty',
    displayName: 'Nova Beauty',
    provider: 'sandbox',
    status: 'connected',
    followers: 54_200,
    following: 340,
    mediaCount: 388,
    connectedAt: iso(60),
  },
  {
    id: 'ig_003',
    workspaceId: 'ws_003',
    username: '@nova.travel',
    displayName: 'Nova Travel',
    provider: 'sandbox',
    status: 'expired',
    followers: 21_050,
    following: 190,
    mediaCount: 210,
  },
]

/* -------------------------------- Content ------------------------------- */

const captions = [
  'Behind the scenes of our autumn drop. Which look is your favorite?',
  'New reel: 3 ways to style the Nova tote in under 15 seconds.',
  'Story takeover this Friday with our design team.',
  'Limited restock is live. Tap to shop before it sells out.',
  'Community spotlight: your creations tagged #NovaMade.',
  'A calm morning routine, Nova edition.',
]

export const contentItems: ContentItem[] = Array.from({ length: 18 }, (_, i) => {
  const types = ['post', 'reel', 'story', 'carousel'] as const
  const statuses = ['draft', 'in_review', 'approved', 'scheduled', 'published', 'failed'] as const
  const status = statuses[i % statuses.length]
  const type = types[i % types.length]
  return {
    id: `c_${String(i + 1).padStart(3, '0')}`,
    workspaceId: 'ws_001',
    accountId: instagramAccounts[i % 2].id,
    type,
    caption: captions[i % captions.length],
    mediaIds: [`md_${String((i % 6) + 1).padStart(3, '0')}`],
    status,
    scheduledAt: status === 'scheduled' ? iso(-1 * ((i % 5) + 1), i) : undefined,
    publishedAt: status === 'published' ? iso((i % 10) + 1) : undefined,
    createdBy: 'u_002',
    aiGenerated: i % 3 === 0,
    metrics:
      status === 'published'
        ? {
            reach: 12_000 + i * 640,
            impressions: 18_400 + i * 900,
            likes: 1_240 + i * 60,
            comments: 84 + i * 4,
            shares: 40 + i * 3,
            saves: 210 + i * 8,
            engagementRate: Number((3.2 + (i % 5) * 0.4).toFixed(1)),
          }
        : undefined,
  }
})

export const mediaAssets: MediaAsset[] = Array.from({ length: 12 }, (_, i) => ({
  id: `md_${String(i + 1).padStart(3, '0')}`,
  workspaceId: 'ws_001',
  kind: i % 4 === 0 ? 'video' : 'image',
  url: '/placeholder.jpg',
  thumbnailUrl: '/placeholder.jpg',
  name: `asset-${i + 1}.${i % 4 === 0 ? 'mp4' : 'jpg'}`,
  sizeBytes: 240_000 + i * 32_000,
  width: 1080,
  height: 1350,
  tags: [['autumn', 'product'], ['reel', 'bts'], ['ugc'], ['studio']][i % 4],
  aiGenerated: i % 5 === 0,
  createdAt: iso(i + 1),
}))

/* ----------------------------- Conversations ---------------------------- */

const handles = ['@sofia_k', '@mark.travels', '@thegreenhouse', '@daily.dose', '@urban_fit', '@lina.makes']

export const conversations: Conversation[] = Array.from({ length: 9 }, (_, i) => ({
  id: `cv_${String(i + 1).padStart(3, '0')}`,
  accountId: instagramAccounts[i % 2].id,
  channel: i % 3 === 0 ? 'comment' : 'dm',
  contactHandle: handles[i % handles.length],
  lastMessage: [
    'Is this back in stock soon?',
    'Loved the reel! Where is the jacket from?',
    'Can I get a discount code?',
    'When does it ship internationally?',
    'Thank you, just placed my order!',
  ][i % 5],
  unreadCount: i % 3,
  assignedTo: i % 2 === 0 ? 'u_002' : undefined,
  sentiment: (['positive', 'neutral', 'negative'] as const)[i % 3],
  aiHandled: i % 4 === 0,
  updatedAt: iso(0, -i),
}))

export const messagesByConversation: Record<string, Message[]> = Object.fromEntries(
  conversations.map((cv) => [
    cv.id,
    [
      {
        id: `${cv.id}_m1`,
        conversationId: cv.id,
        direction: 'inbound',
        author: cv.contactHandle,
        body: cv.lastMessage,
        createdAt: iso(0, -3),
      },
      {
        id: `${cv.id}_m2`,
        conversationId: cv.id,
        direction: 'outbound',
        author: 'Nova Studio',
        body: 'Thanks for reaching out! Let me check that for you right away.',
        aiSuggested: true,
        createdAt: iso(0, -2),
      },
    ],
  ]),
)

export const comments: Comment[] = Array.from({ length: 10 }, (_, i) => ({
  id: `cm_${String(i + 1).padStart(3, '0')}`,
  contentId: contentItems[i % contentItems.length].id,
  accountId: instagramAccounts[i % 2].id,
  author: handles[i % handles.length],
  body: [
    'This is gorgeous 😍',
    'Need this in my life!',
    'Shipping to Canada?',
    'Price please?',
    'Best brand out there.',
  ][i % 5],
  sentiment: (['positive', 'neutral', 'negative'] as const)[i % 3],
  status: (['new', 'replied', 'hidden'] as const)[i % 3],
  likes: i * 3,
  createdAt: iso(0, -i * 2),
}))

/* ---------------------------------- CRM --------------------------------- */

export const leads: Lead[] = Array.from({ length: 14 }, (_, i) => {
  const stages = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'] as const
  return {
    id: `ld_${String(i + 1).padStart(3, '0')}`,
    workspaceId: 'ws_001',
    name: ['Sofia Klein', 'Mark Ito', 'Green House', 'Daily Dose', 'Urban Fit', 'Lina Makes'][i % 6],
    handle: handles[i % handles.length],
    source: (['dm', 'comment', 'story', 'ad', 'manual'] as const)[i % 5],
    stage: stages[i % stages.length],
    value: 200 + i * 145,
    ownerId: i % 2 === 0 ? 'u_002' : 'u_003',
    tags: [['warm'], ['wholesale'], ['vip'], ['newsletter']][i % 4],
    createdAt: iso(i + 2),
    lastActivityAt: iso(i % 5),
  }
})

export const customers: Customer[] = Array.from({ length: 12 }, (_, i) => ({
  id: `cu_${String(i + 1).padStart(3, '0')}`,
  workspaceId: 'ws_001',
  name: ['Sofia Klein', 'Mark Ito', 'Aria Lopez', 'Noah Bright', 'Emma Stone', 'Kai Rivers'][i % 6],
  handle: handles[i % handles.length],
  email: `customer${i + 1}@example.com`,
  lifetimeValue: 320 + i * 210,
  orderCount: 1 + (i % 8),
  tags: [['vip'], ['returning'], ['wholesale']][i % 3],
  segment: (['vip', 'returning', 'new', 'at_risk'] as const)[i % 4],
  createdAt: iso(i * 7 + 5),
}))

/* ------------------------------- Commerce ------------------------------- */

export const categories: ProductCategory[] = [
  { id: 'cat_001', name: 'Apparel', slug: 'apparel', productCount: 24 },
  { id: 'cat_002', name: 'Accessories', slug: 'accessories', productCount: 18 },
  { id: 'cat_003', name: 'Beauty', slug: 'beauty', productCount: 31 },
  { id: 'cat_004', name: 'Home', slug: 'home', productCount: 12 },
]

export const products: Product[] = Array.from({ length: 14 }, (_, i) => ({
  id: `pr_${String(i + 1).padStart(3, '0')}`,
  workspaceId: 'ws_001',
  name: ['Nova Tote', 'Silk Scarf', 'Glow Serum', 'Linen Shirt', 'Ceramic Mug', 'Wool Beanie'][i % 6],
  sku: `NV-${1000 + i}`,
  categoryId: categories[i % categories.length].id,
  price: 24 + i * 9,
  currency: 'USD',
  stock: i % 7 === 0 ? 0 : 12 + i * 3,
  imageUrl: '/placeholder.jpg',
  status: (['active', 'draft', 'archived'] as const)[i % 3 === 0 ? 1 : 0],
  createdAt: iso(i * 4 + 3),
}))

export const orders: Order[] = Array.from({ length: 16 }, (_, i) => {
  const statuses = ['pending', 'paid', 'fulfilled', 'shipped', 'cancelled', 'refunded'] as const
  const qty = 1 + (i % 3)
  const unit = products[i % products.length].price
  const subtotal = unit * qty
  const discount = i % 4 === 0 ? Math.round(subtotal * 0.1) : 0
  return {
    id: `or_${String(i + 1).padStart(3, '0')}`,
    workspaceId: 'ws_001',
    number: `#${2400 + i}`,
    customerId: customers[i % customers.length].id,
    customerName: customers[i % customers.length].name,
    lines: [
      {
        productId: products[i % products.length].id,
        name: products[i % products.length].name,
        quantity: qty,
        unitPrice: unit,
      },
    ],
    subtotal,
    discount,
    total: subtotal - discount,
    currency: 'USD',
    status: statuses[i % statuses.length],
    channel: (['instagram_shop', 'dm', 'manual'] as const)[i % 3],
    createdAt: iso(i),
  }
})

export const discounts: Discount[] = [
  { id: 'dc_001', code: 'AUTUMN10', type: 'percentage', value: 10, usageCount: 184, active: true, expiresAt: iso(-30) },
  { id: 'dc_002', code: 'WELCOME5', type: 'fixed', value: 5, usageCount: 512, active: true },
  { id: 'dc_003', code: 'VIP20', type: 'percentage', value: 20, usageCount: 61, active: false, expiresAt: iso(14) },
]

/* ------------------------------- AI Agents ------------------------------ */

export const agents: AiAgent[] = [
  {
    id: 'ag_content',
    kind: 'content',
    name: 'Content Agent',
    description: 'Drafts captions, hashtags, and post variations aligned to your brand voice.',
    enabled: true,
    autonomy: 'assisted',
    model: 'gpt-class (via AI Gateway)',
    runsToday: 42,
    successRate: 96,
    lastRunAt: iso(0, -1),
  },
  {
    id: 'ag_social',
    kind: 'social',
    name: 'Social Media Agent',
    description: 'Optimizes posting times and auto-schedules approved content.',
    enabled: true,
    autonomy: 'autonomous',
    model: 'gpt-class (via AI Gateway)',
    runsToday: 12,
    successRate: 99,
    lastRunAt: iso(0, -4),
  },
  {
    id: 'ag_sales',
    kind: 'sales',
    name: 'Sales Agent',
    description: 'Turns DMs into qualified leads and recommends the right products.',
    enabled: true,
    autonomy: 'assisted',
    model: 'gpt-class (via AI Gateway)',
    runsToday: 28,
    successRate: 91,
    lastRunAt: iso(0, -2),
  },
  {
    id: 'ag_support',
    kind: 'support',
    name: 'Customer Support Agent',
    description: 'Answers common questions in comments and DMs with your policies.',
    enabled: true,
    autonomy: 'suggest',
    model: 'gpt-class (via AI Gateway)',
    runsToday: 67,
    successRate: 94,
    lastRunAt: iso(0, -1),
  },
  {
    id: 'ag_crm',
    kind: 'crm',
    name: 'CRM Agent',
    description: 'Keeps lead stages, tags, and follow-ups up to date automatically.',
    enabled: false,
    autonomy: 'suggest',
    model: 'gpt-class (via AI Gateway)',
    runsToday: 0,
    successRate: 0,
  },
  {
    id: 'ag_analytics',
    kind: 'analytics',
    name: 'Analytics Agent',
    description: 'Surfaces trends and generates weekly performance narratives.',
    enabled: true,
    autonomy: 'assisted',
    model: 'gpt-class (via AI Gateway)',
    runsToday: 9,
    successRate: 98,
    lastRunAt: iso(1),
  },
  {
    id: 'ag_reco',
    kind: 'recommendation',
    name: 'Recommendation Agent',
    description: 'Suggests products and content ideas based on audience behavior.',
    enabled: true,
    autonomy: 'assisted',
    model: 'gpt-class (via AI Gateway)',
    runsToday: 21,
    successRate: 93,
    lastRunAt: iso(0, -6),
  },
]

export const agentActivity: AgentActivity[] = Array.from({ length: 10 }, (_, i) => ({
  id: `aa_${i + 1}`,
  agentId: agents[i % agents.length].id,
  agentKind: agents[i % agents.length].kind,
  summary: [
    'Drafted 3 caption variations for the autumn drop reel.',
    'Rescheduled 2 posts to peak engagement windows.',
    'Qualified a lead from @sofia_k and tagged as wholesale.',
    'Replied to 12 comments about international shipping.',
    'Generated the weekly performance summary.',
  ][i % 5],
  outcome: (['success', 'pending', 'failed'] as const)[i % 3 === 2 ? 1 : 0],
  createdAt: iso(0, -i * 3),
}))

/* ---------------------------- Notifications ----------------------------- */

export const notifications: AppNotification[] = [
  { id: 'n_1', title: 'Post published', body: 'Autumn drop reel is live on @nova.studio.', kind: 'success', read: false, createdAt: iso(0, -1) },
  { id: 'n_2', title: 'Approval needed', body: '2 posts are waiting for your review.', kind: 'warning', read: false, createdAt: iso(0, -5) },
  { id: 'n_3', title: 'Token expiring', body: '@nova.travel connection expires in 3 days.', kind: 'error', read: false, createdAt: iso(1) },
  { id: 'n_4', title: 'New order', body: 'Order #2410 was placed via Instagram Shop.', kind: 'info', read: true, createdAt: iso(1) },
]

export const auditLogs: AuditLog[] = Array.from({ length: 12 }, (_, i) => ({
  id: `al_${i + 1}`,
  actor: ['Ava Mercer', 'Leo Nakamura', 'Mina Rahimi', 'System'][i % 4],
  action: ['published content', 'updated role', 'connected account', 'exported report', 'edited product'][i % 5],
  target: ['c_004', 'u_003', 'ig_002', 'analytics', 'pr_006'][i % 5],
  ip: '192.0.2.' + (10 + i),
  createdAt: iso(0, -i * 2),
}))

/* ------------------------------- Analytics ------------------------------ */

export const dashboardMetrics: MetricSummary[] = [
  { key: 'followers', label: 'Total followers', value: 203_650, changePct: 4.8, series: seededSeries(7, 14, 200, 30) },
  { key: 'engagement', label: 'Engagement rate', value: 4.6, unit: '%', changePct: 1.2, series: seededSeries(11, 14, 40, 12) },
  { key: 'reach', label: 'Reach (30d)', value: 1_284_000, changePct: 12.4, series: seededSeries(3, 14, 120, 50) },
  { key: 'revenue', label: 'Revenue (30d)', value: 48_240, unit: '$', changePct: 8.1, series: seededSeries(5, 14, 90, 40) },
]

export const followerGrowth = seededSeries(21, 30, 180, 60)
export const engagementByType = [
  { label: 'Reels', value: 5.8 },
  { label: 'Carousel', value: 4.2 },
  { label: 'Posts', value: 3.1 },
  { label: 'Stories', value: 2.4 },
]
export const revenueByChannel = [
  { label: 'Instagram Shop', value: 28_400 },
  { label: 'DM Sales', value: 12_900 },
  { label: 'Link in bio', value: 6_940 },
]
export const salesPipeline = [
  { stage: 'New', value: 42 },
  { stage: 'Contacted', value: 31 },
  { stage: 'Qualified', value: 22 },
  { stage: 'Proposal', value: 14 },
  { stage: 'Won', value: 9 },
]
