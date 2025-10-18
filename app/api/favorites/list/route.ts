import { NextResponse } from "next/server";
import snowflake from "snowflake-sdk";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ✅ Helper to safely close the connection
function destroyConn(conn: snowflake.Connection) {
  return new Promise<void>((resolve) => {
    try {
      conn.destroy(() => resolve());
    } catch {
      resolve();
    }
  });
}

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function getConn() {
  const base: any = {
    account: requireEnv("SNOWFLAKE_ACCOUNT"),
    username: requireEnv("SNOWFLAKE_USER"),
    warehouse: requireEnv("SNOWFLAKE_WAREHOUSE"),
    database: requireEnv("SNOWFLAKE_DATABASE"),
    schema: requireEnv("SNOWFLAKE_SCHEMA"),
    role: requireEnv("SNOWFLAKE_ROLE"),
  };

  if (process.env.SNOWFLAKE_PRIVATE_KEY) {
    const privateKeyPem = Buffer.from(process.env.SNOWFLAKE_PRIVATE_KEY, "base64").toString("utf8");
    return snowflake.createConnection({
      ...base,
      authenticator: "SNOWFLAKE_JWT",
      privateKey: privateKeyPem,
      privateKeyPass: process.env.SNOWFLAKE_PRIVATE_KEY_PASSPHRASE,
    });
  }

  if (process.env.SNOWFLAKE_PASSWORD) {
    return snowflake.createConnection({
      ...base,
      password: process.env.SNOWFLAKE_PASSWORD,
    });
  }

  throw new Error("Snowflake auth not configured (set SNOWFLAKE_PASSWORD or SNOWFLAKE_PRIVATE_KEY).");
}

export async function GET() {
  const conn = getConn();

  try {
    // ✅ Connect
    await new Promise<void>((res, rej) =>
      conn.connect((err) => (err ? rej(err) : res()))
    );

    // ✅ Query from your table
    const sql = `
      SELECT
        PACKAGE_ID,
        NETWORK,
        MODULE_COUNT,
        FUNCTION_COUNT,
        STRUCT_COUNT,
        TO_VARCHAR(INSERTED_AT) AS INSERTED_AT
      FROM HLEE3088_DB.PUBLIC.OPENSUI_CONTRACTS
      ORDER BY INSERTED_AT DESC
      LIMIT 200
    `;

    const rows: any[] = await new Promise((res, rej) =>
      conn.execute({
        sqlText: sql,
        complete: (err, _stmt, rows) => (err ? rej(err) : res(rows || [])),
      })
    );

    const items = rows.map((r) => ({
      PACKAGE_ID: r.PACKAGE_ID,
      NETWORK: r.NETWORK,
      MODULE_COUNT: r.MODULE_COUNT,
      FUNCTION_COUNT: r.FUNCTION_COUNT,
      STRUCT_COUNT: r.STRUCT_COUNT,
      INSERTED_AT: r.INSERTED_AT,
    }));

    return NextResponse.json({ items });
  } catch (e: any) {
    console.error("[favorites/list] error:", e);
    return NextResponse.json(
      { error: e?.message || "List failed" },
      { status: 500 }
    );
  } finally {
    // ✅ Clean up safely (no TS errors)
    await destroyConn(conn);
  }
}
