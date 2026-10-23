import { randomUUID } from "node:crypto";

const STATUS_VALUES = new Set(["new", "contacted", "in_progress", "closed"]);

export class InquiryRepository {
  constructor(db) {
    this.db = db;
    this.insertStatement = db.prepare(`INSERT INTO inquiries
      (id, name, email, company, service, budget, description, status, source, created_at, updated_at)
      VALUES (@id, @name, @email, @company, @service, @budget, @description, 'new', 'website', @createdAt, @updatedAt)`);
    this.findStatement = db.prepare("SELECT * FROM inquiries WHERE id = ?");
  }

  create(input) {
    const now = new Date().toISOString();
    const id = `inq_${randomUUID()}`;
    this.insertStatement.run({ id, ...input, company: input.company || null, budget: input.budget || null, createdAt: now, updatedAt: now });
    return this.findById(id);
  }

  findById(id) {
    const row = this.findStatement.get(id);
    return row ? mapRow(row) : null;
  }

  list({ limit = 50, offset = 0, status, search } = {}) {
    const clauses = [];
    const params = {};
    if (status && STATUS_VALUES.has(status)) {
      clauses.push("status = @status");
      params.status = status;
    }
    if (search) {
      clauses.push("(name LIKE @search OR email LIKE @search OR company LIKE @search OR description LIKE @search)");
      params.search = `%${String(search).slice(0, 100)}%`;
    }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const rows = this.db.prepare(`SELECT * FROM inquiries ${where} ORDER BY created_at DESC LIMIT @limit OFFSET @offset`)
      .all({ ...params, limit: Math.min(Math.max(Number(limit) || 50, 1), 100), offset: Math.max(Number(offset) || 0, 0) });
    const total = this.db.prepare(`SELECT COUNT(*) AS count FROM inquiries ${where}`).get(params).count;
    return { items: rows.map(mapRow), total };
  }

  updateStatus(id, status) {
    if (!STATUS_VALUES.has(status)) throw new Error("Invalid inquiry status.");
    const result = this.db.prepare("UPDATE inquiries SET status = ?, updated_at = ? WHERE id = ?")
      .run(status, new Date().toISOString(), id);
    return result.changes ? this.findById(id) : null;
  }

  deleteById(id) {
    return this.db.prepare("DELETE FROM inquiries WHERE id = ?").run(id).changes > 0;
  }
}

function mapRow(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company || "",
    service: row.service,
    budget: row.budget || "",
    description: row.description,
    status: row.status,
    source: row.source,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
