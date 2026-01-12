-- Create a function to increment scan count safely
create or replace function public.increment_scan_count(row_id uuid)
returns void
language plpgsql
security definer -- This runs with the privileges of the creator (postgres/admin)
as $$
begin
  update public.items
  set 
    scan_count = coalesce(scan_count, 0) + 1,
    last_scan = now()
  where id = row_id;
end;
$$;
