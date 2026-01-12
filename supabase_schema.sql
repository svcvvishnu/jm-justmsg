-- Create a private 'items' table
create table public.items (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null default auth.uid (),
  category text null,
  display_name text null,
  status text null default 'active'::text,
  public_message text null,
  image_url text null,
  qr_code_data text null,
  scan_count bigint null default '0'::bigint,
  last_scan timestamp with time zone null,
  created_at timestamp with time zone not null default now(),
  constraint items_pkey primary key (id),
  constraint items_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete cascade
);

-- Enable RLS
alter table public.items enable row level security;

-- Create policies
create policy "Users can view their own items" on public.items
  for select using ((select auth.uid()) = user_id);

create policy "Users can insert their own items" on public.items
  for insert with check ((select auth.uid()) = user_id);

create policy "Users can update their own items" on public.items
  for update using ((select auth.uid()) = user_id);

create policy "Users can delete their own items" on public.items
  for delete using ((select auth.uid()) = user_id);

-- Create a storage bucket for item images
insert into storage.buckets (id, name, public) 
values ('item-images', 'item-images', true);

-- Policy to allow authenticated uploads
create policy "Authenticated users can upload images"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'item-images' );

-- Policy to allow public viewing of images
create policy "Public can view images"
on storage.objects for select
to public
using ( bucket_id = 'item-images' );
