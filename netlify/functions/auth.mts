 import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

export const handler: Handler = async (event) => {
  try {
    const { area, senha } = JSON.parse(event.body || "{}");

    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("area", area)
      .single();

    if (error || !data || data.senha !== senha) {
      return {
        statusCode: 401,
        body: JSON.stringify({ success: false, message: "Credenciais inválidas" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, user: data }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: String(err) }),
    };
  }
};
