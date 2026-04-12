import { join } from "path";

const WEB_DIR = join(import.meta.dir, "../../System1/web/tools");

const server = Bun.serve({
    port: 7497,
    hostname: "0.0.0.0",
    routes: {
        "/app_version": () => new Response("1.0"),
    },
    async fetch(req) {
        const url = new URL(req.url);
        let path = url.pathname;

        // Serve Homepage.html when accessing the root
        if (path === "/") {
            path = "/HTML/Homepage.html";
        }

        // Map the URL path to the corresponding file in System1/web/tools
        const filePath = join(WEB_DIR, path);
        const file = Bun.file(filePath);

        if (await file.exists()) {
            return new Response(file);
        }

        return new Response("Not Found", { status: 404 });
    }
});

console.log(`Listening on http://localhost:${server.port}`);