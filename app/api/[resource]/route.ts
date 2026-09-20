import { NextResponse } from 'next/server'
import { db } from '@/lib/data'

/**
 * Unified read API for platform resources. Each key maps to a repository
 * method so the transport stays stable while the data source evolves from
 * the sample provider to Supabase.
 *
 * In production every handler must:
 *  - authenticate the request (Supabase session / service role)
 *  - resolve the caller's organization + workspace
 *  - enforce RBAC (see lib/rbac.ts) before returning data
 */
const resources: Record<string, () => Promise<unknown>> = {
  workspaces: () => db.getWorkspaces(),
  memberships: () => db.getMemberships(),
  'instagram-accounts': () => db.getInstagramAccounts(),
  content: () => db.getContent(),
  media: () => db.getMedia(),
  conversations: () => db.getConversations(),
  comments: () => db.getComments(),
  leads: () => db.getLeads(),
  customers: () => db.getCustomers(),
  categories: () => db.getCategories(),
  products: () => db.getProducts(),
  orders: () => db.getOrders(),
  discounts: () => db.getDiscounts(),
  agents: () => db.getAgents(),
  'agent-activity': () => db.getAgentActivity(),
  notifications: () => db.getNotifications(),
  audit: () => db.getAuditLogs(),
  metrics: () => db.getDashboardMetrics(),
  analytics: () => db.getAnalytics(),
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  const { resource } = await params

  if (resource === 'messages') {
    const conversationId = new URL(request.url).searchParams.get('conversationId')
    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId is required' }, { status: 400 })
    }
    return NextResponse.json({ data: await db.getMessages(conversationId) })
  }

  const handler = resources[resource]
  if (!handler) {
    return NextResponse.json({ error: `Unknown resource: ${resource}` }, { status: 404 })
  }

  try {
    const data = await handler()
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: 'Failed to load resource' }, { status: 500 })
  }
}
