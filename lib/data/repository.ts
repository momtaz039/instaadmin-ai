import * as mock from './mock'

/**
 * Data access layer. Every module reads through this repository so the
 * underlying source can be swapped from the in-memory sample provider to
 * Supabase/PostgreSQL without touching UI or API code.
 *
 * To go live: implement a `SupabaseRepository` with the same signatures
 * (see `lib/supabase/*`) and export it from `lib/data/index.ts`.
 */
export interface Repository {
  getCurrentUser(): Promise<typeof mock.currentUser>
  getOrganization(): Promise<typeof mock.organization>
  getWorkspaces(): Promise<typeof mock.workspaces>
  getMemberships(): Promise<typeof mock.memberships>
  getInstagramAccounts(): Promise<typeof mock.instagramAccounts>
  getContent(): Promise<typeof mock.contentItems>
  getMedia(): Promise<typeof mock.mediaAssets>
  getConversations(): Promise<typeof mock.conversations>
  getMessages(conversationId: string): Promise<typeof mock.messagesByConversation[string]>
  getComments(): Promise<typeof mock.comments>
  getLeads(): Promise<typeof mock.leads>
  getCustomers(): Promise<typeof mock.customers>
  getCategories(): Promise<typeof mock.categories>
  getProducts(): Promise<typeof mock.products>
  getOrders(): Promise<typeof mock.orders>
  getDiscounts(): Promise<typeof mock.discounts>
  getAgents(): Promise<typeof mock.agents>
  getAgentActivity(): Promise<typeof mock.agentActivity>
  getNotifications(): Promise<typeof mock.notifications>
  getAuditLogs(): Promise<typeof mock.auditLogs>
  getDashboardMetrics(): Promise<typeof mock.dashboardMetrics>
  getAnalytics(): Promise<{
    followerGrowth: number[]
    engagementByType: typeof mock.engagementByType
    revenueByChannel: typeof mock.revenueByChannel
    salesPipeline: typeof mock.salesPipeline
  }>
}

// Simulate network latency so loading states are exercised in development.
const delay = <T>(value: T, ms = 0): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms))

export const mockRepository: Repository = {
  getCurrentUser: () => delay(mock.currentUser),
  getOrganization: () => delay(mock.organization),
  getWorkspaces: () => delay(mock.workspaces),
  getMemberships: () => delay(mock.memberships),
  getInstagramAccounts: () => delay(mock.instagramAccounts),
  getContent: () => delay(mock.contentItems),
  getMedia: () => delay(mock.mediaAssets),
  getConversations: () => delay(mock.conversations),
  getMessages: (id) => delay(mock.messagesByConversation[id] ?? []),
  getComments: () => delay(mock.comments),
  getLeads: () => delay(mock.leads),
  getCustomers: () => delay(mock.customers),
  getCategories: () => delay(mock.categories),
  getProducts: () => delay(mock.products),
  getOrders: () => delay(mock.orders),
  getDiscounts: () => delay(mock.discounts),
  getAgents: () => delay(mock.agents),
  getAgentActivity: () => delay(mock.agentActivity),
  getNotifications: () => delay(mock.notifications),
  getAuditLogs: () => delay(mock.auditLogs),
  getDashboardMetrics: () => delay(mock.dashboardMetrics),
  getAnalytics: () =>
    delay({
      followerGrowth: mock.followerGrowth,
      engagementByType: mock.engagementByType,
      revenueByChannel: mock.revenueByChannel,
      salesPipeline: mock.salesPipeline,
    }),
}
