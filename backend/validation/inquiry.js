import { ValidationError } from "../errors.js";

export const SERVICE_OPTIONS = [
  "Software & web applications",
  "AI & machine learning",
  "Consulting & technical direction",
  "Workflow automation",
  "API & systems integration",
  "Technical prototyping & MVP development",
  "Not sure yet",
];

export const BUDGET_OPTIONS = [
  "Under ₹50,000",
  "₹50,000 – ₹2,00,000",
  "₹2,00,000 – ₹5,00,000",
  "₹5,00,000+",
  "Prefer to discuss",
];

const serviceSet = new Set(SERVICE_OPTIONS);
const budgetSet = new Set(BUDGET_OPTIONS);

export function validateInquiry(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new ValidationError("Request body must be an object.");
  }

  const inquiry = {
    name: clean(body.name, 120),
    email: clean(body.email, 180).toLowerCase(),
    company: clean(body.company, 160),
    service: clean(body.service, 120),
    budget: clean(body.budget, 80),
    description: clean(body.description, 5000),
  };
  const fields = {};

  if (inquiry.name.length < 2) fields.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(inquiry.email)) fields.email = "Please enter a valid business email.";
  if (!serviceSet.has(inquiry.service)) fields.service = "Please choose a service area.";
  if (inquiry.budget && !budgetSet.has(inquiry.budget)) fields.budget = "Please choose a valid budget range.";
  if (inquiry.description.length < 20) fields.description = "Please share a little more about the project.";

  if (Object.keys(fields).length) {
    throw new ValidationError("Please correct the highlighted fields.", fields);
  }

  return inquiry;
}

function clean(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
