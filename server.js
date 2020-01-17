const express = require("express");

const server = express();

const projectRouter = require("./projects/router.js");

server.use(express.json());
server.use(logger);
server.use("/api/projects", projectRouter);

server.get("/", (req, res) => {
  res.send(`<h1>Base URI Page</h1>`);
});

function logger(req, res, next) {
  console.log({
    method: req.method,
    body: req.body || "none",
    url: req.url,
    timestamp: Date.now()
  });
  next();
}

module.exports = server;
