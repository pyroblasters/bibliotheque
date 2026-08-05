import { getStore } from "@netlify/blobs";

// Protection optionnelle : si la variable d'environnement LIBRARY_API_KEY est
// définie dans Netlify (Site configuration > Environment variables), le header
// x-api-key devient obligatoire. Si elle n'est pas définie, l'API reste ouverte.
function isAuthorized(req) {
  const required = process.env.LIBRARY_API_KEY;
  if (!required) return true;
  return req.headers.get("x-api-key") === required;
}

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-api-key",
};

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  if (!isAuthorized(req)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...cors },
    });
  }

  const store = getStore("library");

  if (req.method === "GET") {
    const data = await store.get("books", { type: "json" });
    return new Response(JSON.stringify(data || []), {
      headers: { "Content-Type": "application/json", ...cors },
    });
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }
    if (!Array.isArray(body)) {
      return new Response(JSON.stringify({ error: "Expected an array of books" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }
    await store.setJSON("books", body);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json", ...cors },
    });
  }

  return new Response("Method not allowed", { status: 405, headers: cors });
};

export const config = {
  path: "/api/library",
};
