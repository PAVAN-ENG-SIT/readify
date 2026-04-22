-- ═══════════════════════════════════════════════════════════
-- READIFY — 006 EBooks Storage Migration
-- ═══════════════════════════════════════════════════════════

ALTER TABLE public.books ADD COLUMN IF NOT EXISTS file_url text;
