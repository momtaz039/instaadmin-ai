import { mockRepository, type Repository } from './repository'

/**
 * Active data provider. Switch this to a Supabase-backed implementation once
 * the integration is connected. The `DATA_PROVIDER` env var lets deployments
 * flip between sample data and live data without code changes.
 *
 *   const db = process.env.DATA_PROVIDER === 'supabase'
 *     ? supabaseRepository
 *     : mockRepository
 */
export const db: Repository = mockRepository

export type { Repository }
