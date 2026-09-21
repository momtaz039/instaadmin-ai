'use client'

import * as mock from './mock'

function useMockResource<T>(data: T) {
  return { data, error: undefined, isLoading: false, mutate: async () => {} }
}

export const useWorkspaces = () => useMockResource(mock.workspaces)
export const useMemberships = () => useMockResource(mock.memberships)
export const useInstagramAccounts = () => useMockResource(mock.instagramAccounts)
export const useContent = () => useMockResource(mock.contentItems)
export const useMedia = () => useMockResource(mock.mediaAssets)
export const useConversations = () => useMockResource(mock.conversations)
export const useComments = () => useMockResource(mock.comments)
export const useLeads = () => useMockResource(mock.leads)
export const useCustomers = () => useMockResource(mock.customers)
export const useCategories = () => useMockResource(mock.categories)
export const useProducts = () => useMockResource(mock.products)
export const useOrders = () => useMockResource(mock.orders)
export const useDiscounts = () => useMockResource(mock.discounts)
export const useAgents = () => useMockResource(mock.agents)
export const useAgentActivity = () => useMockResource(mock.agentActivity)
export const useNotifications = () => useMockResource(mock.notifications)
export const useAuditLogs = () => useMockResource(mock.auditLogs)
export const useMetrics = () => useMockResource(mock.dashboardMetrics)

export function useMessages(conversationId: string | null) {
  const data = conversationId ? mock.messagesByConversation[conversationId] || [] : []
  return useMockResource(data)
}

export function useAnalytics() {
  return useMockResource({
    followerGrowth: [],
    engagementByType: mock.engagementByType,
    revenueByChannel: mock.revenueByChannel,
    salesPipeline: mock.salesPipeline,
  })
}
