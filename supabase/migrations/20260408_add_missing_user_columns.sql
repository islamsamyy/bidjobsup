-- Add missing columns to users table for settings functionality
-- Run this migration to enable settings, notifications, and privacy features

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS notification_prefs jsonb DEFAULT '{"email_new_bid": true, "email_bid_status": true, "email_new_message": true, "email_weekly_digest": false}'::jsonb,
ADD COLUMN IF NOT EXISTS privacy_settings jsonb DEFAULT '{"profile_visible": true, "show_hourly_rate": true, "show_location": true}'::jsonb;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_users_notification_prefs ON public.users (notification_prefs);
CREATE INDEX IF NOT EXISTS idx_users_privacy_settings ON public.users (privacy_settings);

-- Add comment
COMMENT ON COLUMN public.users.notification_prefs IS 'User notification preferences stored as JSON: email_new_bid, email_bid_status, email_new_message, email_weekly_digest';
COMMENT ON COLUMN public.users.privacy_settings IS 'User privacy settings stored as JSON: profile_visible, show_hourly_rate, show_location';
