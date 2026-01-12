-- Add GPS coordinates to messages table for "Lost Mode" tracking
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS gps_lat double precision,
ADD COLUMN IF NOT EXISTS gps_long double precision;

-- Add flexible metadata column to items for "Identity Mode" (social links) and other extensions
ALTER TABLE public.items 
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Comment on columns
COMMENT ON COLUMN public.messages.gps_lat IS 'Latitude of where the item was scanned (if user allowed)';
COMMENT ON COLUMN public.messages.gps_long IS 'Longitude of where the item was scanned (if user allowed)';
COMMENT ON COLUMN public.items.metadata IS 'Flexible JSON storage for social links, reward info, etc.';
