-- Allow public read access to items (so scanners can see them)
create policy "Public can view items"
on public.items for select
to public
using ( true );

-- Create messages table
create table public.messages (
  id uuid not null default gen_random_uuid (),
  item_id uuid not null,
  sender_contact text null, -- Optional email or phone from scanner
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone not null default now(),
  constraint messages_pkey primary key (id),
  constraint messages_item_id_fkey foreign KEY (item_id) references public.items (id) on delete cascade
);

-- Enable RLS
alter table public.messages enable row level security;

-- Policy: Public can insert messages (scanners sending msg)
create policy "Public can send messages"
on public.messages for insert
to public
with check ( true );

-- Policy: Owners can view messages for their items
create policy "Users can view messages for their items"
on public.messages for select
using (
  exists (
    select 1 from public.items
    where items.id = messages.item_id
    and items.user_id = auth.uid()
  )
);
