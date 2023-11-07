Bun.serve({
  port: 3000,
  async fetch(req) {
    if(req.path == "/"){
      return new Response("bingle servidor");
    }
  },
  error() {
    return new Response(null, { status: 404 });
  },
});
