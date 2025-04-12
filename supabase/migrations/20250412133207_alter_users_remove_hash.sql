-- Remove password_hash column from users table
-- This is because we're using Supabase Auth to handle authentication
-- and we don't need to store password hashes in our custom users table
ALTER TABLE users
DROP COLUMN IF EXISTS password_hash;
