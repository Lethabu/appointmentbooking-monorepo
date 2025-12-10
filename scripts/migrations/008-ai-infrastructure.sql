-- Supabase Database Setup for AI Agents
-- File: scripts/migrations/008-ai-infrastructure.sql
-- Date: 2024-12-02
-- Purpose: Create tables for AI conversation memory and human handoffs

-- ============================================
-- AI CONVERSATIONS TABLE
-- ============================================
-- Stores all AI agent conversations for context and memory

CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('system', 'user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_conversations_user 
  ON ai_conversations(user_id);

CREATE INDEX IF NOT EXISTS idx_conversations_agent 
  ON ai_conversations(agent_name);

CREATE INDEX IF NOT EXISTS idx_conversations_created 
  ON ai_conversations(created_at DESC);

-- Composite index for common query pattern
CREATE INDEX IF NOT EXISTS idx_conversations_user_agent 
  ON ai_conversations(user_id, agent_name, created_at DESC);

-- ============================================
-- AI HANDOFFS TABLE
-- ============================================
-- Tracks when AI agents escalate to human support

CREATE TABLE IF NOT EXISTS ai_handoffs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  reason TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP,
  resolved_by TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_handoffs_user 
  ON ai_handoffs(user_id);

CREATE INDEX IF NOT EXISTS idx_handoffs_agent 
  ON ai_handoffs(agent_name);

-- Partial index for unresolved handoffs (most common query)
CREATE INDEX IF NOT EXISTS idx_handoffs_unresolved 
  ON ai_handoffs(created_at DESC) 
  WHERE NOT resolved;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on both tables
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_handoffs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access (for backend operations)
CREATE POLICY "Service role has full access to conversations" 
  ON ai_conversations 
  FOR ALL 
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to handoffs" 
  ON ai_handoffs 
  FOR ALL 
  USING (auth.role() = 'service_role');

-- Policy: Authenticated users can read their own conversations
CREATE POLICY "Users can read their own conversations" 
  ON ai_conversations 
  FOR SELECT 
  USING (auth.uid()::text = user_id);

-- Policy: Authenticated users can read their own handoffs
CREATE POLICY "Users can read their own handoffs" 
  ON ai_handoffs 
  FOR SELECT 
  USING (auth.uid()::text = user_id);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get recent conversation history
CREATE OR REPLACE FUNCTION get_conversation_history(
  p_user_id TEXT,
  p_agent_name TEXT,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  role TEXT,
  content TEXT,
  created_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.role,
    c.content,
    c.created_at
  FROM ai_conversations c
  WHERE c.user_id = p_user_id
    AND c.agent_name = p_agent_name
  ORDER BY c.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get unresolved handoffs
CREATE OR REPLACE FUNCTION get_unresolved_handoffs()
RETURNS TABLE (
  id UUID,
  user_id TEXT,
  agent_name TEXT,
  reason TEXT,
  created_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    h.id,
    h.user_id,
    h.agent_name,
    h.reason,
    h.created_at
  FROM ai_handoffs h
  WHERE NOT h.resolved
  ORDER BY h.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to resolve a handoff
CREATE OR REPLACE FUNCTION resolve_handoff(
  p_handoff_id UUID,
  p_resolved_by TEXT,
  p_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE ai_handoffs
  SET 
    resolved = TRUE,
    resolved_at = NOW(),
    resolved_by = p_resolved_by,
    notes = p_notes
  WHERE id = p_handoff_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SAMPLE DATA (for testing)
-- ============================================

-- Insert sample conversation
INSERT INTO ai_conversations (user_id, agent_name, role, content)
VALUES 
  ('test-user-001', 'Nia', 'user', 'Hi, I want to book an appointment'),
  ('test-user-001', 'Nia', 'assistant', 'Hello! I''d be happy to help you book an appointment at Instyle Hair Boutique! 💇‍♀️ Which service are you interested in?');

-- Insert sample handoff
INSERT INTO ai_handoffs (user_id, agent_name, reason)
VALUES 
  ('test-user-002', 'Nia', 'Customer requested to speak with a human about pricing');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify tables exist
SELECT table_name, table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('ai_conversations', 'ai_handoffs')
ORDER BY table_name;

-- Verify indexes
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename IN ('ai_conversations', 'ai_handoffs')
ORDER BY tablename, indexname;

-- Verify RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN ('ai_conversations', 'ai_handoffs');

-- Test conversation history function
SELECT * FROM get_conversation_history('test-user-001', 'Nia', 10);

-- Test unresolved handoffs function
SELECT * FROM get_unresolved_handoffs();

-- ============================================
-- CLEANUP (for development/testing only)
-- ============================================
-- Uncomment to reset tables

-- DROP TABLE IF EXISTS ai_conversations CASCADE;
-- DROP TABLE IF EXISTS ai_handoffs CASCADE;
-- DROP FUNCTION IF EXISTS get_conversation_history CASCADE;
-- DROP FUNCTION IF EXISTS get_unresolved_handoffs CASCADE;
-- DROP FUNCTION IF EXISTS resolve_handoff CASCADE;
