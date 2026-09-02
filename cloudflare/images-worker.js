export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const key = url.pathname.replace(/^\/+/, "");

    if (!key) return new Response("Not found", { status: 404 });

    const originBase = env.B2_PUBLIC_BASE_URL.replace(/\/$/, "");
    const originUrl = `${originBase}/${key}`;
    const cache = caches.default;
    const cacheKey = new Request(request.url, request);

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405 });
    }

    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    const originResponse = await fetch(originUrl, {
      method: request.method,
      headers: request.headers,
      cf: { cacheEverything: true },
    });

    if (!originResponse.ok) return originResponse;

    const response = new Response(originResponse.body, originResponse);
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  },
};
