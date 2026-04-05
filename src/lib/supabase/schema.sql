-- Books platform schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Books table
create table books (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  status text not null default 'draft' check (status in ('draft', 'generating', 'ready', 'failed')),
  params jsonb not null default '{}',
  pdf_digital_url text,
  pdf_print_url text,
  image_regenerations_left integer not null default 3,
  text_regenerations_left integer not null default 3,
  stripe_payment_intent_id text,
  paid boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Characters table
create table characters (
  id uuid primary key default uuid_generate_v4(),
  book_id uuid references books(id) on delete cascade not null,
  name text not null,
  role text not null default 'main' check (role in ('main', 'secondary')),
  image_url text,
  description text,
  character_prompt text,
  created_at timestamptz not null default now()
);

-- Book pages table
create table book_pages (
  id uuid primary key default uuid_generate_v4(),
  book_id uuid references books(id) on delete cascade not null,
  page_number integer not null,
  text text,
  image_url text,
  image_prompt text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique(book_id, page_number)
);

-- Regeneration log
create table regeneration_log (
  id uuid primary key default uuid_generate_v4(),
  book_id uuid references books(id) on delete cascade not null,
  page_id uuid references book_pages(id) on delete cascade,
  type text not null check (type in ('image', 'text')),
  old_value text,
  new_value text,
  created_at timestamptz not null default now()
);

-- Staff users for back-office access
create table staff_users (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid references auth.users(id) on delete cascade not null unique,
  email text not null unique,
  role text not null default 'owner' check (role in ('owner', 'manager', 'support', 'marketing')),
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Customer CRM profile
create table customer_profiles (
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

create table customer_tags (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  color text not null default '#24414d',
  description text,
  is_system boolean not null default false,
  created_at timestamptz not null default now()
);

create table customer_tag_assignments (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references customer_profiles(id) on delete cascade not null,
  tag_id uuid references customer_tags(id) on delete cascade not null,
  assigned_by_staff_user_id uuid references staff_users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(customer_id, tag_id)
);

create table customer_notes (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references customer_profiles(id) on delete cascade not null,
  staff_user_id uuid references staff_users(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table promotions (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  kind text not null check (kind in ('percentage', 'fixed')),
  scope text not null default 'campaign' check (scope in ('campaign', 'single_use')),
  amount integer not null check (amount > 0),
  currency text not null default 'ILS',
  usage_limit integer,
  used_count integer not null default 0,
  expires_at timestamptz,
  assigned_customer_id uuid references customer_profiles(id) on delete set null,
  is_active boolean not null default true,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table orders (
  id uuid primary key default uuid_generate_v4(),
  order_number bigint generated always as identity unique,
  customer_id uuid references customer_profiles(id) on delete set null,
  source text not null default 'manual' check (source in ('manual', 'stripe')),
  status text not null default 'paid' check (status in ('draft', 'pending_payment', 'paid', 'fulfilled', 'cancelled', 'refunded')),
  order_type text not null default 'physical' check (order_type in ('digital', 'physical', 'hybrid')),
  currency text not null default 'ILS',
  subtotal_amount integer not null default 0,
  discount_amount integer not null default 0,
  total_amount integer not null default 0,
  promotion_id uuid references promotions(id) on delete set null,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text unique,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table shipping_addresses (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references customer_profiles(id) on delete set null,
  order_id uuid references orders(id) on delete cascade not null unique,
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

create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade not null,
  book_id uuid references books(id) on delete set null,
  product_type text not null default 'book' check (product_type in ('book', 'upsell', 'service')),
  product_title text not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_amount integer not null default 0,
  total_amount integer not null default 0,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table payment_transactions (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade not null,
  customer_id uuid references customer_profiles(id) on delete set null,
  provider text not null default 'manual' check (provider in ('manual', 'stripe')),
  kind text not null check (kind in ('charge', 'refund', 'manual')),
  status text not null check (status in ('pending', 'succeeded', 'failed')),
  amount integer not null,
  currency text not null default 'ILS',
  provider_transaction_id text,
  stripe_event_id text unique,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table fulfillment_orders (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade not null unique,
  book_id uuid references books(id) on delete set null,
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

create table support_tickets (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references customer_profiles(id) on delete set null,
  order_id uuid references orders(id) on delete set null,
  book_id uuid references books(id) on delete set null,
  source text not null default 'contact_form' check (source in ('contact_form', 'manual')),
  status text not null default 'open' check (status in ('open', 'pending', 'resolved')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  subject text not null,
  message text not null,
  resolution_type text,
  resolution_payload jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  closed_at timestamptz
);

create table activity_events (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references customer_profiles(id) on delete cascade,
  order_id uuid references orders(id) on delete cascade,
  book_id uuid references books(id) on delete cascade,
  ticket_id uuid references support_tickets(id) on delete cascade,
  actor_staff_user_id uuid references staff_users(id) on delete set null,
  actor_type text not null default 'system' check (actor_type in ('system', 'customer', 'staff')),
  event_type text not null,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table promotion_redemptions (
  id uuid primary key default uuid_generate_v4(),
  promotion_id uuid references promotions(id) on delete cascade not null,
  customer_id uuid references customer_profiles(id) on delete cascade,
  order_id uuid references orders(id) on delete cascade,
  discount_amount integer not null default 0,
  created_at timestamptz not null default now()
);

create table marketing_assets (
  id uuid primary key default uuid_generate_v4(),
  asset_type text not null check (asset_type in ('blog_post', 'social_post', 'newsletter', 'upsell_insert')),
  status text not null default 'draft' check (status in ('draft', 'ready')),
  goal text,
  topic text not null,
  segment_snapshot jsonb not null default '{}',
  title text,
  content jsonb not null default '{}',
  meta jsonb not null default '{}',
  created_by_staff_user_id uuid references staff_users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table audience_exports (
  id uuid primary key default uuid_generate_v4(),
  asset_id uuid references marketing_assets(id) on delete set null,
  filters jsonb not null default '{}',
  export_format text not null default 'csv' check (export_format in ('csv')),
  file_name text not null,
  record_count integer not null default 0,
  snapshot jsonb not null default '[]',
  created_by_staff_user_id uuid references staff_users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- RLS policies
alter table books enable row level security;
alter table characters enable row level security;
alter table book_pages enable row level security;
alter table regeneration_log enable row level security;
alter table staff_users enable row level security;
alter table customer_profiles enable row level security;
alter table customer_tags enable row level security;
alter table customer_tag_assignments enable row level security;
alter table customer_notes enable row level security;
alter table promotions enable row level security;
alter table orders enable row level security;
alter table shipping_addresses enable row level security;
alter table order_items enable row level security;
alter table payment_transactions enable row level security;
alter table fulfillment_orders enable row level security;
alter table support_tickets enable row level security;
alter table activity_events enable row level security;
alter table promotion_redemptions enable row level security;
alter table marketing_assets enable row level security;
alter table audience_exports enable row level security;

-- Books: users can only see their own books
create policy "Users can view own books" on books
  for select using (auth.uid() = user_id);

create policy "Users can insert own books" on books
  for insert with check (auth.uid() = user_id);

create policy "Users can update own books" on books
  for update using (auth.uid() = user_id);

-- Characters: access via book ownership
create policy "Users can manage characters of own books" on characters
  for all using (
    exists (select 1 from books where books.id = characters.book_id and books.user_id = auth.uid())
  );

-- Pages: access via book ownership
create policy "Users can manage pages of own books" on book_pages
  for all using (
    exists (select 1 from books where books.id = book_pages.book_id and books.user_id = auth.uid())
  );

-- Regeneration log: access via book ownership
create policy "Users can view regen log of own books" on regeneration_log
  for all using (
    exists (select 1 from books where books.id = regeneration_log.book_id and books.user_id = auth.uid())
  );

-- Updated at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger books_updated_at
  before update on books
  for each row execute function update_updated_at();

create trigger staff_users_updated_at
  before update on staff_users
  for each row execute function update_updated_at();

create trigger customer_profiles_updated_at
  before update on customer_profiles
  for each row execute function update_updated_at();

create trigger customer_notes_updated_at
  before update on customer_notes
  for each row execute function update_updated_at();

create trigger promotions_updated_at
  before update on promotions
  for each row execute function update_updated_at();

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

create trigger shipping_addresses_updated_at
  before update on shipping_addresses
  for each row execute function update_updated_at();

create trigger fulfillment_orders_updated_at
  before update on fulfillment_orders
  for each row execute function update_updated_at();

create trigger support_tickets_updated_at
  before update on support_tickets
  for each row execute function update_updated_at();

create trigger marketing_assets_updated_at
  before update on marketing_assets
  for each row execute function update_updated_at();
