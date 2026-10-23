CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL CHECK (length(name) BETWEEN 2 AND 120),
  email TEXT NOT NULL CHECK (length(email) BETWEEN 3 AND 180),
  company TEXT CHECK (company IS NULL OR length(company) <= 160),
  service TEXT NOT NULL,
  budget TEXT CHECK (budget IS NULL OR length(budget) <= 80),
  description TEXT NOT NULL CHECK (length(description) BETWEEN 20 AND 5000),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'closed')),
  source TEXT NOT NULL DEFAULT 'website' CHECK (source = 'website'),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status_created_at ON inquiries (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries (email);
