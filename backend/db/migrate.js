import { loadConfig } from "../config.js";
import { openDatabase } from "./database.js";

const config = loadConfig();
const db = openDatabase({ databasePath: config.databasePath, legacyStorePath: config.legacyStorePath });
const migrationCount = db.prepare("SELECT COUNT(*) AS count FROM schema_migrations").get().count;
const inquiryCount = db.prepare("SELECT COUNT(*) AS count FROM inquiries").get().count;
db.close();

console.log(`Database ready: ${config.databasePath}`);
console.log(`Applied migrations: ${migrationCount}`);
console.log(`Stored inquiries: ${inquiryCount}`);
