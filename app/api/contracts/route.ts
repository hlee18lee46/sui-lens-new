import { NextResponse } from "next/server";
import snowflake from "snowflake-sdk";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { packageId, network, moduleCount, functionCount, structCount, normalized } = body;

const connection = snowflake.createConnection({
  account: process.env.SNOWFLAKE_ACCOUNT!,
  username: process.env.SNOWFLAKE_USER!,
  password: process.env.SNOWFLAKE_PASSWORD!,
  warehouse: process.env.SNOWFLAKE_WAREHOUSE!,
  database: process.env.SNOWFLAKE_DATABASE!,
  schema: process.env.SNOWFLAKE_SCHEMA!,
  role: process.env.SNOWFLAKE_ROLE!,
});


    // Connect to Snowflake
    await new Promise((resolve, reject) => {
      connection.connect((err, conn) => (err ? reject(err) : resolve(conn)));
    });

    // Prepare SQL
    const sql = `
      INSERT INTO HLEE3088_DB.PUBLIC.OPENSUI_CONTRACTS
        (PACKAGE_ID, NETWORK, MODULE_COUNT, FUNCTION_COUNT, STRUCT_COUNT, NORMALIZED)
      SELECT ?, ?, ?, ?, ?, PARSE_JSON(?)
    `;

    // Execute
    const res = await new Promise((resolve, reject) => {
      connection.execute({
        sqlText: sql,
        binds: [
          packageId,
          network,
          moduleCount,
          functionCount,
          structCount,
          JSON.stringify(normalized),
        ],
        complete: (err, stmt, rows) => (err ? reject(err) : resolve(rows)),
      });
    });

    return NextResponse.json({ success: true, inserted: true });
  } catch (error: any) {
    console.error("Snowflake insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
