# instaadmin-ai

AI-powered Instagram administration, automation, CRM, store and sales platform.
Next.js (App Router) · TypeScript · Tailwind · Supabase · Vercel.

## اجرا (Codespaces یا لوکال)

```bash
pnpm install          # lockfile را هم به‌روز می‌کند (وابستگی قدیمی `cn` حذف شود: pnpm remove cn)
pnpm typecheck        # خطاهای TypeScript را نشان می‌دهد
pnpm dev              # http://localhost:3000
```

## دیتابیس (Supabase → SQL Editor)

1. `supabase/schema.sql` را یک‌بار اجرا کن.
2. بعد `supabase/policies.sql` را اجرا کن (RLS و نقش‌ها).
3. `.env.example` را به `.env.local` کپی و مقادیر را پر کن.

## وضعیت

- آماده: قاب اصلی (sidebar / موبایل / RTL)، داشبورد، RBAC، دیتای نمایشی، Schema و RLS.
- در حال ساخت: بقیهٔ صفحه‌ها، Supabase Auth واقعی، اتصال Meta، عامل‌های AI.
- `/login` فعلاً نمایشی است و احراز هویت واقعی ندارد. قبل از ذخیرهٔ داده واقعی باید عوض شود.
