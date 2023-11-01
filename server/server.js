Bun.serve({
    port: 3000,
    fetch(req) {
        const url = new URL(req.url);
        if (url.pathname === "/") return new Response(Bun.file("index.html"));
        if (url.pathname === "/blog") return new Response("Blog!");
        return new Response("does not exist");
    },
});