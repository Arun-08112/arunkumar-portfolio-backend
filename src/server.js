import "dotenv/config";
import app from "./app.js";
import { pool, verifyDatabase } from "./config/db.js";

const port = Number(process.env.PORT || 5000);
if (
  !process.env.DB_PASSWORD ||
  process.env.DB_PASSWORD === "replace_with_your_password"
) {
  console.error("Set DB_PASSWORD in your .env file before starting.");
  process.exit(1);
}

try {
  const db = await verifyDatabase();
  console.log(`Connected to PostgreSQL database: ${db.database}`);
  const server = app.listen(port, () =>
    console.log(`API running at http://localhost:${port}`),
  );
  const stop = async () => {
    server.close();
    await pool.end();
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
} catch (error) {
  console.error("Database connection failed:", error.message);
  await pool.end();
  process.exit(1);
}
