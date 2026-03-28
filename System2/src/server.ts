import homepage from "./index.html";
import { join } from "path";

const server = Bun.serve({
    port: 7497,
    routes: {
        "/": homepage
    },
    async fetch(req) {
        const url = new URL(req.url);
        
        // Serve static assets from src folder (paths like /style.css, /tools/images/...)
        const filePath = join(import.meta.dir, url.pathname);
        const file = Bun.file(filePath);
        
        if (await file.exists()) {
            return new Response(file);
        }
        
        return new Response("Not Found", { status: 404 });
    }
});

console.log(`Listening on http://${server.hostname}:${server.port}`);