const http = require("http");
const fs = require("fs");
const path = require("path");

const mime = {
    html: "text/html",
    css: "text/css",
    js: "application/javascript"
};

const renderHTML = (path, response) => {
    response.writeHead(200, {"Content-Type": "text/html"});
    fs.readFile(path, null, function(error, data) {
        if (error) {
            response.writeHead(404);
            response.write("File does not exists!");
        } else {
            response.write(data);
        }
        response.end();
    });
};

// サーバーを生成
const myServer = http.createServer(requestListener = (req, res) => {

    const reqpath = req.url.toString().split("?")[0];
    const type = mime[path.extname(reqpath).slice(1)] || "text/html";

    switch(type){
        case "text/html":
            renderHTML("./index.html", res);
            break;
        default:
            if (req.method !== "GET") {
                res.statusCode = 501;
                res.setHeader("Content-Type", "text/plain");
                return res.end("Method not implemented");
            }
            const file = path.join(__dirname, reqpath)
            const s = fs.createReadStream(file);
            s.on("open", function () {
                res.setHeader("Content-Type", type);
                s.pipe(res);
            });
            s.on("error", function () {
                res.setHeader("Content-Type", "text/plain");
                res.statusCode = 404;
                res.end("Not found");
            });
            break;
    }
});

// ポート番号:8081で受け付け開始
console.log("Server listening on port 8088");
myServer.listen(port = 8088);