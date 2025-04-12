-- Create enum types for Goal and DietaryPreference
CREATE TYPE user_goal AS ENUM (
  'cook-with-ingredients',
  'quick-recipes',
  'healthy-meals',
  'shopping-list',
  'improve-skills',
  ''
);

CREATE TYPE dietary_preference AS ENUM (
  'vegetarian-vegan',
  'no-preference',
  'keto-lowcarb',
  'gluten-dairy-free'
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal user_goal DEFAULT '',
  dietary_preferences dietary_preference[] DEFAULT '{}',
  allergies TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create an index on user_id for faster lookups
CREATE INDEX user_preferences_user_id_idx ON user_preferences(user_id);

-- Set up Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to access preferences
CREATE POLICY "Authenticated users can view preferences" 
  ON user_preferences 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert preferences" 
  ON user_preferences 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update preferences" 
  ON user_preferences 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Create function to automatically set updated_at on updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on updates
CREATE TRIGGER update_user_preferences_updated_at
BEFORE UPDATE ON user_preferences
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
