const fs = require('fs');
const path = require('path');

const root = process.cwd();

// 1. حذف فایل‌های pnpm
try { fs.unlinkSync('pnpm-lock.yaml'); } catch {}
try { fs.unlinkSync('pnpm-workspace.yaml'); } catch {}

// 2. حذف pnpm از package.json
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  delete pkg.packageManager;
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
} catch {}

// 3. حذف پوشه‌های داینامیک
function removeDirs(dir, pattern) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      if (pattern.test(entry)) {
        fs.rmSync(full, { recursive: true, force: true });
      } else {
        removeDirs(full, pattern);
      }
    }
  }
}
removeDirs(path.join(root, 'app'), /^\[.*\]$/);
removeDirs(path.join(root, 'app'), /^api$/);

// 4. حذف فایل‌های خالی
function removeEmpty(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const full = path.join(dir, entry);
    if (entry === 'node_modules' || entry === '.git') continue;
    if (fs.statSync(full).isDirectory()) {
      removeEmpty(full);
    } else if (fs.statSync(full).size === 0) {
      fs.unlinkSync(full);
    }
  }
}
removeEmpty(root);

// 5. اصلاح hooks.ts
const hooksPath = path.join(root, 'lib', 'data', 'hooks.ts');
fs.mkdirSync(path.dirname(hooksPath), { recursive: true });
fs.writeFileSync(hooksPath, `'use client'

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
`);

// 6. اصلاح Supabase clients
const supabaseDir = path.join(root, 'lib', 'supabase');
fs.mkdirSync(supabaseDir, { recursive: true });
fs.writeFileSync(path.join(supabaseDir, 'client.ts'), `import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
`);
fs.writeFileSync(path.join(supabaseDir, 'server.ts'), `import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options))
          } catch {}
        },
      },
    }
  )
}
`);

console.log('Auto-fix completed successfully.');
