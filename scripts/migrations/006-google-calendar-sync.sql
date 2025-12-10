-- Migration: Add Google Calendar synchronization tables
-- Enables tenant calendar integration for booking synchronization

-- Table for storing calendar connection credentials and settings
CREATE TABLE calendar_connections (
  tenant_id TEXT PRIMARY KEY,
  google_calendar_id TEXT NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_expiry INTEGER, -- Unix timestamp in seconds
  last_sync INTEGER, -- Unix timestamp in seconds
  is_active INTEGER DEFAULT 1,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  sync_settings TEXT -- JSON: sync preferences, time zones, etc.
);

-- Table for tracking individual calendar sync events
CREATE TABLE calendar_sync_events (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  booking_id TEXT NOT NULL REFERENCES appointments(id),
  google_event_id TEXT NOT NULL,
  sync_timestamp INTEGER DEFAULT (unixepoch()),
  sync_status TEXT CHECK(sync_status IN ('created', 'updated', 'deleted', 'failed')),
  error_message TEXT,
  last_attempt INTEGER DEFAULT (unixepoch())
);

-- Table for Google Calendar API settings (global)
CREATE TABLE google_calendar_config (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Insert default Google Calendar sync configuration
INSERT INTO google_calendar_config (key, value) VALUES
('client_id', 'YOUR_GOOGLE_CLIENT_ID'),
('client_secret', 'YOUR_GOOGLE_CLIENT_SECRET'),
('redirect_uri', 'https://www.instylehairboutique.co.za/api/google-calendar/oauth/callback'),
('sync_direction', 'system_to_calendar'),
('sync_frequency', 'realtime'),
('conflict_resolution', 'deny');

-- Indexes for performance
CREATE INDEX idx_calendar_connections_tenant ON calendar_connections(tenant_id);
CREATE INDEX idx_calendar_sync_events_booking ON calendar_sync_events(booking_id);
CREATE INDEX idx_calendar_sync_events_tenant ON calendar_sync_events(tenant_id);
CREATE INDEX idx_calendar_sync_events_status ON calendar_sync_events(sync_status);
