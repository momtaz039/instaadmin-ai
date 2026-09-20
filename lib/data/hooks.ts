'use client'

import useSWR from 'swr'
import type * as mock from './mock'

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? 'Request failed')
  }
  const json = await res.json()
  return json.data as T
}

function useResource<T>(resource: string | null) {
  const { data, error, isLoading, mutate } = useSWR<T>(
    resource ? `/api/${resource}` : null,
    fetcher,
    { revalidateOnFocus: false },
  )
  return { data, error: error as Error | undefined, isLoading, mutate }
}

export const useWorkspaces = () => useResource<typeof mock.workspaces>('workspaces')
export const useMemberships = () => useResource<typeof mock.memberships>('memberships')
export const useInstagramAccounts = () =>
  useResource<typeof mock.instagramAccounts>('instagram-accounts')
export const useContent = () => useResource<typeof mock.contentItems>('content')
export const useMedia = () => useResource<typeof mock.mediaAssets>('media')
export const useConversations = () => useResource<typeof mock.conversations>('conversations')
export const useComments = () => useResource<typeof mock.comments>('comments')
export const useLeads = () => useResource<typeof mock.leads>('leads')
export const useCustomers = () => useResource<typeof mock.customers>('customers')
export const useCategories = () => useResource<typeof mock.categories>('categories')
export const useProducts = () => useResource<typeof mock.products>('products')
export const useOrders = () => useResource<typeof mock.orders>('orders')
export const useDiscounts = () => useResource<typeof mock.discounts>('discounts')
export const useAgents = () => useResource<typeof mock.agents>('agents')
export const useAgentActivity = () => useResource<typeof mock.agentActivity>('agent-activity')
export const useNotifications = () => useResource<typeof mock.notifications>('notifications')
export const useAuditLogs = () => useResource<typeof mock.auditLogs>('audit')
export const useMetrics = () => useResource<typeof mock.dashboardMetrics>('metrics')

export function useMessages(conversationId: string | null) {
return useResource<typeof mock.messagesByConversation[string]>(
    conversationId ? `messages?conversationId=${conversationId}` : null,
  )
}
export function useAnalytics() {
  return useResource<{
    followerGrowth: number[]
    engagementByType: typeof mock.engagementByType
    revenueByChannel: typeof mock.revenueByChannel
    salesPipeline: typeof mock.salesPipeline
  }>('analytics')
}
