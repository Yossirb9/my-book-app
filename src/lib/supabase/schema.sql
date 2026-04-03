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

-- RLS policies
alter table books enable row level security;
alter table characters enable row level security;
alter table book_pages enable row level security;
alter table regeneration_log enable row level security;

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
