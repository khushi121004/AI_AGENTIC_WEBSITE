// utils/findFreePort.js
const net = require("net");

async function findFreePort(start = 3001) {
  function checkPort(port) {
    return new Promise((resolve) => {
      const server = net.createServer();
      server.once("error", () => resolve(false));
      server.once("listening", () => {
        server.close(() => resolve(true));
      });
      server.listen(port, "0.0.0.0");
    });
  }

  let port = start;
  while (!(await checkPort(port))) {
    port++;
  }
  return port;
}

module.exports = { findFreePort };
