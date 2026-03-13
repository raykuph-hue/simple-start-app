# Phosify — AI Website Builder

An AI-powered website builder SaaS where users can generate, edit, and publish business websites using AI. Built with React + Vite + Supabase.

## Architecture

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, shadcn/ui, React Router v6
- **Backend**: Supabase (auth, database, edge functions)
- **Payments**: Stripe (via Supabase Edge Functions)
- **AI**: Supabase Edge Function calls Lovable AI Gateway / configurable AI provider

## Running the App

```bash
npm run dev   # Starts Vite dev server on port 5000
npm run build # Production build
```

## Environment Variables (Secrets)

| Secret | Description |
|--------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key |

The following secrets are configured in the **Supabase dashboard** (for Edge Functions):
- `STRIPE_SECRET_KEY` — Stripe secret key
- `LOVABLE_API_KEY` — AI gateway key for website generation

## Project Structure

```
src/
  App.tsx                        # Router + providers
  pages/
    Index.tsx                    # Landing page
    Auth.tsx                     # Sign in / sign up
    Dashboard.tsx                # User dashboard (websites, billing)
    Builder.tsx                  # AI website builder form
    Admin.tsx                    # Admin panel
    ResetPassword.tsx / UpdatePassword.tsx
  hooks/
    useAuth.tsx                  # Supabase auth context
    useAdminApi.ts               # Admin API calls (via Supabase Edge Function)
    useStockImages.ts            # Stock image search
  integrations/
    supabase/
      client.ts                  # Supabase client (reads VITE_SUPABASE_* env vars)
      types.ts                   # Auto-generated Supabase types
  components/
    ui/                          # shadcn/ui components
    billing/                     # Billing history
    builder/                     # Builder sub-components
    brand/                       # Logo
    domain/                      # Custom domain modal
    landing/                     # Landing page sections
    website/                     # Website editor
supabase/
  functions/
    generate-website/            # AI website generation (calls AI gateway)
    check-subscription/          # Stripe subscription checker
    create-checkout/             # Stripe checkout session creator
    customer-portal/             # Stripe billing portal
    admin-api/                   # Admin CRUD operations
    verify-domain/               # DNS domain verification
  migrations/                    # SQL migrations (run against Supabase project)
```

## Supabase Database Tables

- `profiles` — user plans, site limits, Stripe IDs
- `websites` — generated websites (HTML, subdomain, publish status)
- `domains` — custom domains per website
- `user_roles` — admin/moderator role assignments
- `admin_audit_logs` — admin action logs
- `analytics_summary` — platform analytics

## Plans

| Plan | Sites | Ads | Watermark | Custom Domains |
|------|-------|-----|-----------|----------------|
| Free | 1 | Yes | Yes | No |
| Starter | 5 | No | No | No |
| Pro | Unlimited | No | No | Yes |
