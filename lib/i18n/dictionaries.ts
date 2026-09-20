import type { Locale } from './config'

/**
 * Flat dictionary keyed by dotted path. The default UI language is English.
 * Persian (fa) entries fall back to English when a key is missing, so the app
 * stays fully functional while translations are completed.
 */
export const dictionaries = {
  en: {
    'app.name': 'Lumina',
    'app.tagline': 'AI Instagram Growth Platform',

    'nav.section.overview': 'Overview',
    'nav.section.content': 'Content & Engagement',
    'nav.section.commerce': 'Commerce & CRM',
    'nav.section.intelligence': 'Intelligence',
    'nav.section.workspace': 'Workspace',

    'nav.dashboard': 'Dashboard',
    'nav.content': 'Content',
    'nav.calendar': 'Calendar',
    'nav.media': 'Media',
    'nav.instagram': 'Instagram',
    'nav.messages': 'Messages',
    'nav.comments': 'Comments',
    'nav.crm': 'CRM',
    'nav.customers': 'Customers',
    'nav.sales': 'Sales',
    'nav.shop': 'Shop',
    'nav.orders': 'Orders',
    'nav.analytics': 'Analytics',
    'nav.agents': 'AI Agents',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    'nav.team': 'Team',

    'common.search': 'Search',
    'common.searchPlaceholder': 'Search anything…',
    'common.new': 'New',
    'common.create': 'Create',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.viewAll': 'View all',
    'common.loading': 'Loading…',
    'common.retry': 'Retry',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.status': 'Status',
    'common.actions': 'Actions',
    'common.upgrade': 'Upgrade',

    'empty.title': 'Nothing here yet',
    'empty.description': 'Get started by creating your first item.',
    'error.title': 'Something went wrong',
    'error.description': 'We could not load this data. Please try again.',

    'auth.signIn': 'Sign in',
    'auth.signOut': 'Sign out',
    'auth.signUp': 'Create account',
  },
  fa: {
    'app.name': 'لومینا',
    'app.tagline': 'پلتفرم رشد اینستاگرام مبتنی بر هوش مصنوعی',

    'nav.section.overview': 'نمای کلی',
    'nav.section.content': 'محتوا و تعامل',
    'nav.section.commerce': 'تجارت و CRM',
    'nav.section.intelligence': 'هوشمندی',
    'nav.section.workspace': 'فضای کاری',

    'nav.dashboard': 'داشبورد',
    'nav.content': 'محتوا',
    'nav.calendar': 'تقویم',
    'nav.media': 'رسانه',
    'nav.instagram': 'اینستاگرام',
    'nav.messages': 'پیام‌ها',
    'nav.comments': 'نظرات',
    'nav.crm': 'مدیریت ارتباط',
    'nav.customers': 'مشتریان',
    'nav.sales': 'فروش',
    'nav.shop': 'فروشگاه',
    'nav.orders': 'سفارشات',
    'nav.analytics': 'تجزیه و تحلیل',
    'nav.agents': 'عوامل هوش مصنوعی',
    'nav.reports': 'گزارش‌ها',
    'nav.settings': 'تنظیمات',
    'nav.team': 'تیم',

    'common.search': 'جستجو',
    'common.searchPlaceholder': 'جستجوی هر چیزی…',
    'common.new': 'جدید',
    'common.create': 'ایجاد',
    'common.save': 'ذخیره',
    'common.cancel': 'انصراف',
    'common.delete': 'حذف',
    'common.edit': 'ویرایش',
    'common.viewAll': 'مشاهده همه',
    'common.loading': 'در حال بارگذاری…',
    'common.retry': 'تلاش دوباره',
    'common.filter': 'فیلتر',
    'common.export': 'خروجی',
    'common.status': 'وضعیت',
    'common.actions': 'عملیات',
    'common.upgrade': 'ارتقا',

    'empty.title': 'هنوز چیزی اینجا نیست',
    'empty.description': 'با ایجاد اولین مورد خود شروع کنید.',
    'error.title': 'مشکلی پیش آمد',
    'error.description': 'بارگذاری این داده‌ها ممکن نشد. لطفاً دوباره تلاش کنید.',

    'auth.signIn': 'ورود',
    'auth.signOut': 'خروج',
    'auth.signUp': 'ایجاد حساب',
  },
} as const

export type DictionaryKey = keyof (typeof dictionaries)['en']

export function translate(locale: Locale, key: DictionaryKey): string {
  const table = dictionaries[locale] as Record<string, string>
  return table[key] ?? dictionaries.en[key] ?? key
}
