import {
  Camera,
  ChartColumn,
  Bot,
  CalendarDays,
  FileText,
  Images,
  LayoutDashboard,
  MessageCircle,
  MessagesSquare,
  Package,
  Receipt,
  Settings,
  ShoppingBag,
  Sparkles,
  Store,
  TrendingUp,
  Users,
  SquareUser,
  type LucideIcon,
} from 'lucide-react'
import type { Permission } from './rbac'

export interface NavItem {
  label: string
  labelFa: string
  href: string
  icon: LucideIcon
  permission: Permission
  badge?: 'live'
}

export interface NavGroup {
  title: string
  titleFa: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    title: 'Overview',
    titleFa: 'نمای کلی',
    items: [
      { label: 'Dashboard', labelFa: 'داشبورد', href: '/dashboard', icon: LayoutDashboard, permission: 'dashboard:view' },
      { label: 'Analytics', labelFa: 'تجزیه و تحلیل', href: '/analytics', icon: ChartColumn, permission: 'analytics:view' },
      { label: 'Reports', labelFa: 'گزارش‌ها', href: '/reports', icon: FileText, permission: 'reports:view' },
    ],
  },
  {
    title: 'Content',
    titleFa: 'محتوا',
    items: [
      { label: 'Content Studio', labelFa: 'استودیوی محتوا', href: '/content', icon: Sparkles, permission: 'content:view' },
      { label: 'Calendar', labelFa: 'تقویم', href: '/calendar', icon: CalendarDays, permission: 'content:view' },
      { label: 'Media', labelFa: 'رسانه', href: '/media', icon: Images, permission: 'media:manage' },
      { label: 'Instagram', labelFa: 'اینستاگرام', href: '/instagram', icon: Camera, permission: 'content:view' },
    ],
  },
  {
    title: 'Engage',
    titleFa: 'تعامل',
    items: [
      { label: 'Messages', labelFa: 'پیام‌ها', href: '/messages', icon: MessagesSquare, permission: 'inbox:view' },
      { label: 'Comments', labelFa: 'نظرات', href: '/comments', icon: MessageCircle, permission: 'inbox:view' },
    ],
  },
  {
    title: 'CRM',
    titleFa: 'مدیریت ارتباط',
    items: [
      { label: 'Pipeline', labelFa: 'خط لوله', href: '/crm', icon: TrendingUp, permission: 'crm:view' },
      { label: 'Customers', labelFa: 'مشتریان', href: '/customers', icon: SquareUser, permission: 'crm:view' },
    ],
  },
  {
    title: 'Commerce',
    titleFa: 'تجارت',
    items: [
      { label: 'Sales', labelFa: 'فروش', href: '/sales', icon: ShoppingBag, permission: 'commerce:view' },
      { label: 'Shop', labelFa: 'فروشگاه', href: '/shop', icon: Store, permission: 'commerce:view' },
      { label: 'Orders', labelFa: 'سفارشات', href: '/orders', icon: Receipt, permission: 'commerce:view' },
    ],
  },
  {
    title: 'Automation',
    titleFa: 'اتوماسیون',
    items: [
      { label: 'AI Agents', labelFa: 'نمایندگان هوش مصنوعی', href: '/agents', icon: Bot, permission: 'agents:view' },
    ],
  },
  {
    title: 'Workspace',
    titleFa: 'فضای کاری',
    items: [
      { label: 'Team', labelFa: 'تیم', href: '/team', icon: Users, permission: 'team:manage' },
      { label: 'Settings', labelFa: 'تنظیمات', href: '/settings', icon: Settings, permission: 'settings:manage' },
    ],
  },
]

// Primary items surfaced in the mobile bottom navigation.
export const mobilePrimary: NavItem[] = [
  { label: 'Dashboard', labelFa: 'داشبورد', href: '/dashboard', icon: LayoutDashboard, permission: 'dashboard:view' },
  { label: 'Content', labelFa: 'محتوا', href: '/content', icon: Sparkles, permission: 'content:view' },
  { label: 'Messages', labelFa: 'پیام‌ها', href: '/messages', icon: MessagesSquare, permission: 'inbox:view' },
  { label: 'Orders', labelFa: 'سفارشات', href: '/orders', icon: Package, permission: 'commerce:view' },
  { label: 'Agents', labelFa: 'نمایندگان', href: '/agents', icon: Bot, permission: 'agents:view' },
]

export const allNavItems = navGroups.flatMap((g) => g.items)
