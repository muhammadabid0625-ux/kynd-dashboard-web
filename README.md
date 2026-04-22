# Kynd Saving Dashboard Web

Production-oriented Next.js dashboard project for:

- private admin dashboard
- affiliate dashboard
- referral tracking route
- payout management
- notification management structure
- configurable app/store links

This project is separate from the mobile app and is designed to deploy on Vercel.

## Stack

- Next.js App Router
- TypeScript
- Server-side Supabase REST integration
- Role-based route protection
- Vercel-ready folder structure

## Routes

### Public

- `/login`
- `/r/:code`

### Admin

- `/admin`
- `/admin/users`
- `/admin/users/:id`
- `/admin/analytics`
- `/admin/notifications`
- `/admin/referrals`
- `/admin/payouts`
- `/admin/settings`

### Affiliate

- `/affiliate`
- `/affiliate/link`
- `/affiliate/earnings`
- `/affiliate/payouts`
- `/affiliate/settings`

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_APP_NAME=Kynd Saving Dashboard
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```

## Supabase setup

Run this migration in Supabase SQL Editor:

- `supabase/migrations/20260422_dashboard_backend.sql`

This creates:

- `dashboard_user_roles`
- `affiliate_profiles`
- `referral_settings`
- `referral_clicks`
- `referral_conversions`
- `affiliate_earnings`
- `affiliate_payouts`
- `push_tokens`
- `notification_templates`
- `notification_logs`
- `user_activity_daily`
- `audit_logs`

It also seeds:

- default referral settings row
- default morning and night notification templates

## Important role bootstrap

This dashboard requires users to exist in `dashboard_user_roles`.

Example admin bootstrap SQL:

```sql
insert into public.dashboard_user_roles (user_id, role, display_name)
values ('YOUR_AUTH_USER_UUID', 'admin', 'Admin User')
on conflict (user_id) do update
set role = excluded.role,
    display_name = excluded.display_name,
    status = 'active';
```

Example affiliate bootstrap SQL:

```sql
insert into public.dashboard_user_roles (user_id, role, display_name)
values ('YOUR_AUTH_USER_UUID', 'affiliate', 'Affiliate User')
on conflict (user_id) do update
set role = excluded.role,
    display_name = excluded.display_name,
    status = 'active';

insert into public.affiliate_profiles (user_id, referral_code, status)
values ('YOUR_AUTH_USER_UUID', 'abid001', 'active')
on conflict (user_id) do nothing;
```

## Notifications

This project includes the production structure for notifications:

- notification templates
- specific user notification logging
- title
- body
- `emphasis_text` for highlighted or bold/semi-bold preview text
- timezone-aware send hour storage
- push token storage

Actual Expo Push / FCM dispatch workers can be added later on top of these tables.

## Referral system behavior

Referral links use a stable format:

- `/r/:code`

Behavior:

- tracks click
- stores platform, country, destination, source URL, IP, user agent
- redirects using dashboard-configured settings

This means you can later add real Play Store / App Store URLs in admin settings without changing existing affiliate links.

## Local development

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Type-check:

```bash
npx tsc --noEmit
```

Build:

```bash
npm run build
```

## Vercel deployment

1. Extract this folder
2. Add environment variables in Vercel
3. Connect project
4. Deploy

Recommended Vercel env values:

- `NEXT_PUBLIC_SITE_URL` should be your deployed dashboard URL
- Supabase URL and keys should come from the same project used by the mobile app

## Notes

- Billing is intentionally not implemented yet
- This dashboard reads from the existing finance tables created for the mobile app
- Admin and affiliate access are web-only
- Mobile app UI remains separate
