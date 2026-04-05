create extension if not exists "uuid-ossp";

create table if not exists public.staff_users (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid references auth.users(id) on delete cascade not null unique,
  email text not null unique,
  role text not null default 'owner' check (role in ('owner', 'manager', 'support', 'marketing')),
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_profiles (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid references auth.users(id) on delete set null unique,
  full_name text,
  email text not null unique,
  phone text,
  organization_name text,
  customer_type text not null default 'b2c' check (customer_type in ('b2c', 'b2b')),
  lifecycle_status text not null default 'lead' check (lifecycle_status in ('lead', 'paying', 'returning')),
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  registered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_tags (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  color text not null default '#24414d',
  description text,
  is_system boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.customer_tag_assignments (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references public.customer_profiles(id) on delete cascade not null,
  tag_id uuid references public.customer_tags(id) on delete cascade not null,
  assigned_by_staff_user_id uuid references public.staff_users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(customer_id, tag_id)
);

create table if not exists public.customer_notes (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references public.customer_profiles(id) on delete cascade not null,
  staff_user_id uuid references public.staff_users(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.promotions (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  kind text not null check (kind in ('percentage', 'fixed')),
  scope text not null default 'campaign' check (scope in ('campaign', 'single_use')),
  amount integer not null check (amount > 0),
  currency text not null default 'ILS',
  usage_limit integer,
  used_count integer not null default 0,
  expires_at timestamptz,
  assigned_customer_id uuid references public.customer_profiles(id) on delete set null,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_number bigint generated always as identity unique,
  customer_id uuid references public.customer_profiles(id) on delete set null,
  source text not null default 'manual' check (source in ('manual', 'stripe')),
  status text not null default 'paid' check (status in ('draft', 'pending_payment', 'paid', 'fulfilled', 'cancelled', 'refunded')),
  order_type text not null default 'physical' check (order_type in ('digital', 'physical', 'hybrid')),
  currency text not null default 'ILS',
  subtotal_amount integer not null default 0,
  discount_amount integer not null default 0,
  total_amount integer not null default 0,
  promotion_id uuid references public.promotions(id) on delete set null,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text unique,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shipping_addresses (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references public.customer_profiles(id) on delete set null,
  order_id uuid references public.orders(id) on delete cascade not null unique,
  recipient_name text not null,
  phone text,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text,
  postal_code text,
  country text not null default 'IL',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade not null,
  book_id uuid references public.books(id) on delete set null,
  product_type text not null default 'book' check (product_type in ('book', 'upsell', 'service')),
  product_title text not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_amount integer not null default 0,
  total_amount integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.payment_transactions (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade not null,
  customer_id uuid references public.customer_profiles(id) on delete set null,
  provider text not null default 'manual' check (provider in ('manual', 'stripe')),
  kind text not null check (kind in ('charge', 'refund', 'manual')),
  status text not null check (status in ('pending', 'succeeded', 'failed')),
  amount integer not null,
  currency text not null default 'ILS',
  provider_transaction_id text,
  stripe_event_id text unique,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.fulfillment_orders (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade not null unique,
  book_id uuid references public.books(id) on delete set null,
  status text not null default 'pending_print' check (status in ('pending_print', 'sent_to_printer', 'printing', 'shipped', 'delivered', 'error_hold')),
  printer_name text,
  printer_job_ref text,
  print_binding text not null default 'soft' check (print_binding in ('soft', 'hard')),
  print_page_count integer,
  tracking_number text,
  tracking_url text,
  hold_reason text,
  sent_to_printer_at timestamptz,
  shipped_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references public.customer_profiles(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  book_id uuid references public.books(id) on delete set null,
  source text not null default 'contact_form' check (source in ('contact_form', 'manual')),
  status text not null default 'open' check (status in ('open', 'pending', 'resolved')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  subject text not null,
  message text not null,
  resolution_type text,
  resolution_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  closed_at timestamptz
);

create table if not exists public.activity_events (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references public.customer_profiles(id) on delete cascade,
  order_id uuid references public.orders(id) on delete cascade,
  book_id uuid references public.books(id) on delete cascade,
  ticket_id uuid references public.support_tickets(id) on delete cascade,
  actor_staff_user_id uuid references public.staff_users(id) on delete set null,
  actor_type text not null default 'system' check (actor_type in ('system', 'customer', 'staff')),
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.promotion_redemptions (
  id uuid primary key default uuid_generate_v4(),
  promotion_id uuid references public.promotions(id) on delete cascade not null,
  customer_id uuid references public.customer_profiles(id) on delete cascade,
  order_id uuid references public.orders(id) on delete cascade,
  discount_amount integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.marketing_assets (
  id uuid primary key default uuid_generate_v4(),
  asset_type text not null check (asset_type in ('blog_post', 'social_post', 'newsletter', 'upsell_insert')),
  status text not null default 'draft' check (status in ('draft', 'ready')),
  goal text,
  topic text not null,
  segment_snapshot jsonb not null default '{}'::jsonb,
  title text,
  content jsonb not null default '{}'::jsonb,
  meta jsonb not null default '{}'::jsonb,
  created_by_staff_user_id uuid references public.staff_users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audience_exports (
  id uuid primary key default uuid_generate_v4(),
  asset_id uuid references public.marketing_assets(id) on delete set null,
  filters jsonb not null default '{}'::jsonb,
  export_format text not null default 'csv' check (export_format in ('csv')),
  file_name text not null,
  record_count integer not null default 0,
  snapshot jsonb not null default '[]'::jsonb,
  created_by_staff_user_id uuid references public.staff_users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_customer_profiles_auth_user_id on public.customer_profiles (auth_user_id);
create index if not exists idx_customer_profiles_lifecycle_status on public.customer_profiles (lifecycle_status);
create index if not exists idx_customer_profiles_customer_type on public.customer_profiles (customer_type);
create index if not exists idx_customer_tag_assignments_customer_id on public.customer_tag_assignments (customer_id);
create index if not exists idx_customer_notes_customer_id on public.customer_notes (customer_id, created_at desc);
create index if not exists idx_promotions_scope_is_active on public.promotions (scope, is_active);
create index if not exists idx_orders_customer_id on public.orders (customer_id, created_at desc);
create index if not exists idx_orders_status on public.orders (status);
create index if not exists idx_order_items_order_id on public.order_items (order_id);
create index if not exists idx_payment_transactions_order_id on public.payment_transactions (order_id, created_at desc);
create index if not exists idx_fulfillment_orders_status on public.fulfillment_orders (status, created_at);
create index if not exists idx_support_tickets_status on public.support_tickets (status, created_at desc);
create index if not exists idx_support_tickets_customer_id on public.support_tickets (customer_id, created_at desc);
create index if not exists idx_activity_events_customer_id on public.activity_events (customer_id, created_at desc);
create index if not exists idx_activity_events_order_id on public.activity_events (order_id, created_at desc);
create index if not exists idx_activity_events_book_id on public.activity_events (book_id, created_at desc);
create index if not exists idx_promotion_redemptions_promotion_id on public.promotion_redemptions (promotion_id, created_at desc);
create index if not exists idx_marketing_assets_asset_type on public.marketing_assets (asset_type, created_at desc);

alter table public.staff_users enable row level security;
alter table public.customer_profiles enable row level security;
alter table public.customer_tags enable row level security;
alter table public.customer_tag_assignments enable row level security;
alter table public.customer_notes enable row level security;
alter table public.promotions enable row level security;
alter table public.orders enable row level security;
alter table public.shipping_addresses enable row level security;
alter table public.order_items enable row level security;
alter table public.payment_transactions enable row level security;
alter table public.fulfillment_orders enable row level security;
alter table public.support_tickets enable row level security;
alter table public.activity_events enable row level security;
alter table public.promotion_redemptions enable row level security;
alter table public.marketing_assets enable row level security;
alter table public.audience_exports enable row level security;

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'staff_users_updated_at') then
    create trigger staff_users_updated_at
      before update on public.staff_users
      for each row execute function public.update_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'customer_profiles_updated_at') then
    create trigger customer_profiles_updated_at
      before update on public.customer_profiles
      for each row execute function public.update_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'customer_notes_updated_at') then
    create trigger customer_notes_updated_at
      before update on public.customer_notes
      for each row execute function public.update_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'promotions_updated_at') then
    create trigger promotions_updated_at
      before update on public.promotions
      for each row execute function public.update_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'orders_updated_at') then
    create trigger orders_updated_at
      before update on public.orders
      for each row execute function public.update_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'shipping_addresses_updated_at') then
    create trigger shipping_addresses_updated_at
      before update on public.shipping_addresses
      for each row execute function public.update_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'fulfillment_orders_updated_at') then
    create trigger fulfillment_orders_updated_at
      before update on public.fulfillment_orders
      for each row execute function public.update_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'support_tickets_updated_at') then
    create trigger support_tickets_updated_at
      before update on public.support_tickets
      for each row execute function public.update_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'marketing_assets_updated_at') then
    create trigger marketing_assets_updated_at
      before update on public.marketing_assets
      for each row execute function public.update_updated_at();
  end if;
end $$;
