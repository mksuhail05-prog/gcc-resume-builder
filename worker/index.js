export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/parse-cv" && request.method === "POST") {
      return Response.json({
        ok: true,
        message: "Worker API route is working"
      });
    }

    if (url.pathname.startsWith("/api/")) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return env.ASSETS.fetch(request);
  }
};
