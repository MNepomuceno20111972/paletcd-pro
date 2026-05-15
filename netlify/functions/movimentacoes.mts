 import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod === "GET") {
      const limit = event.queryStringParameters?.limit || "100";
      const { data, error } = await supabase
        .from("movimentacoes")
        .select("*")
        .order("ts", { ascending: false })
        .limit(parseInt(limit));

      return {
        statusCode: error ? 400 : 200,
        body: JSON.stringify({ data, error }),
      };
    }

    if (event.httpMethod === "POST") {
      const { id, tipo, origem, destino, qtd, modelos, usuario, observacao, data_mov } = JSON.parse(event.body || "{}");
      const { data, error } = await supabase
        .from("movimentacoes")
        .insert([{ id, tipo, origem, destino, qtd, modelos, usuario, observacao, data_mov }]);

      return {
        statusCode: error ? 400 : 200,
        body: JSON.stringify({ data, error }),
      };
    }

    if (event.httpMethod === "DELETE") {
      const { id } = JSON.parse(event.body || "{}");
      const { error } = await supabase
        .from("movimentacoes")
        .delete()
        .eq("id", id);

      return {
        statusCode: error ? 400 : 200,
        body: JSON.stringify({ success: !error }),
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
