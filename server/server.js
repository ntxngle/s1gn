Bun.serve({
  port: 3000,
  async fetch(req) {
    const filePath = "./" + new URL(req.url).pathname;
    const file = Bun.file(filePath);
    return new Response(file);
  },
  error() {
    return new Response(null, { status: 404 });
  },
});
