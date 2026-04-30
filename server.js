const http = require("http");
const fs = require("fs");
const path = require("path");

let clients = [];

const server = http.createServer((req, res) => {
    if (req.url === "/events") {
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        });

        res.write("\n");

        clients.push(res);

        // 🔥 연결 끊기면 제거
        req.on("close", () => {
            clients = clients.filter((c) => c !== res);
        });

        return;
    }

    let filePath = "." + (req.url === "/" ? "/index.html" : req.url);

    const ext = path.extname(filePath);
    const contentType = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "application/javascript",
    }[ext] || "text/plain";

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end("Not found");
        } else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content);
        }
    });
});

// 🔥 변경 감지 → 모든 클라이언트에 push
fs.watch(".", { recursive: true }, () => {
    clients.forEach((res) => {
        res.write(`data: reload\n\n`);
    });
});

server.listen(3000, () => {
    console.log("http://localhost:3000");
});