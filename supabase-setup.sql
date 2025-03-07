-- Create a function to create the discord_invites table if it doesn't exist
CREATE OR REPLACE FUNCTION create_discord_invites_table()
RETURNS void AS $$
BEGIN
  -- Check if the table exists
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'discord_invites'
  ) THEN
    -- Create the table
    CREATE TABLE public.discord_invites (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email TEXT NOT NULL UNIQUE,
      invite_link TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      used BOOLEAN DEFAULT FALSE
    );

    -- Add Row Level Security (RLS) policies
    ALTER TABLE public.discord_invites ENABLE ROW LEVEL SECURITY;

    -- Allow authenticated users to read/write to this table
    CREATE POLICY "Authenticated users can manage invites" 
      ON public.discord_invites 
      FOR ALL
      TO authenticated
      USING (true);
      
    -- Allow anon users to insert (for the API endpoint)
    CREATE POLICY "Anon users can insert invites" 
      ON public.discord_invites 
      FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;
END;
$$ LANGUAGE plpgsql;

