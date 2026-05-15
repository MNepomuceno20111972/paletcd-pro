 import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod === "GET") {
      const area = event.queryStringParameters?.area;
      const { data, error } = await supabase
        .from("estoque")
        .select("*")
        .eq("area", area);

      return {
        statusCode: error ? 400 : 200,
        body: JSON.stringify({ data, error }),
      };
    }

    if (event.httpMethod === "POST") {
      const { area, pbrpalete, descartavel, chep, euro, chep_euro, gaiola } = JSON.parse(event.body || "{}");
      const { data, error } = await supabase
        .from("estoque")
        .upsert({ area, pbrpalete, descartavel, chep, euro, chep_euro, gaiola, atualizado_em: new Date() });

      return {
        statusCode: error ? 400 : 200,
        body: JSON.stringify({ data, error }),
      };
    }

    return { statusCode: 405, body: "Method not allowed" };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: String(err) }),
    };
  }
};
