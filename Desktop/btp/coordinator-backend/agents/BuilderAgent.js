// agents/BuilderAgent.js
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { findFreePort } = require("../utils/findFreePort");

class BuilderAgent {
  constructor() {
    console.log("BuilderAgent initialized");
  }

  async generateBaseArchitecture(project) {
    const baseDir = path.join(process.cwd(), "project_env");
    fs.mkdirSync(baseDir, { recursive: true });

    const frontendPath = path.join(baseDir, "frontend");
    const backendPath = path.join(baseDir, "backend");
    const dbPath = path.join(baseDir, "db");
    fs.mkdirSync(frontendPath, { recursive: true });
    fs.mkdirSync(backendPath, { recursive: true });
    fs.mkdirSync(dbPath, { recursive: true });

    // ====== FRONTEND ======
    await this._generateReactFrontend(frontendPath, project);

    // ====== BACKEND ======
    await this._generateExpressBackend(backendPath, project);

    // ====== DATABASE ======
    this._generateDatabase(project, dbPath);

    console.log("✅ BuilderAgent: Base architecture generated successfully!");

    // Install dependencies and start servers automatically
    await this._installAndStart(frontendPath, backendPath);

    return { frontendPath, backendPath, dbPath };
  }

  // ---------- Frontend ----------
  async _generateReactFrontend(frontendPath, project) {
    // src folder
    const srcPath = path.join(frontendPath, "src");
    if (!fs.existsSync(srcPath)) fs.mkdirSync(srcPath, { recursive: true });

    const appJs = `
import React from "react";
function App() {
  return (
    <div>
      <h1>Welcome to ${project.websiteName}</h1>
      <p>Pages: ${project.pages.join(", ")}</p>
    </div>
  );
}
export default App;
`;
    fs.writeFileSync(path.join(srcPath, "App.js"), appJs);

    const indexJs = `
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
fs.writeFileSync(path.join(srcPath, "index.js"), indexJs);

    // public folder with index.html
    const publicPath = path.join(frontendPath, "public");
    if (!fs.existsSync(publicPath)) fs.mkdirSync(publicPath, { recursive: true });

    const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.websiteName}</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
`;
    fs.writeFileSync(path.join(publicPath, "index.html"), indexHtml);

    // package.json
    const pkgJson = {
      name: project.websiteName.toLowerCase(),
      version: "1.0.0",
      private: true,
      scripts: {
        start: "react-scripts start",
        build: "react-scripts build"
      },
      dependencies: {
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        "react-scripts": "^5.0.1"
      }
    };
    fs.writeFileSync(path.join(frontendPath, "package.json"), JSON.stringify(pkgJson, null, 2));

    const port = await findFreePort(3001); // start looking from 3001
    const envContent = `PORT=${port}\nBROWSER=none\n`;
    fs.writeFileSync(path.join(frontendPath, ".env"), envContent);
    console.log(`✅ React frontend .env created with PORT=${port}`);
  }

  // ---------- Backend ----------
  async _generateExpressBackend(backendPath, project) {
    const serverJs = `
const express = require("express");
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => res.send("Welcome to ${project.websiteName} API"));

app.listen(PORT, () => console.log("🚀 Express backend running on port " + PORT));
`;
    fs.writeFileSync(path.join(backendPath, "server.js"), serverJs);

    const pkgJson = {
      name: `${project.websiteName.toLowerCase()}-backend`,
      version: "1.0.0",
      private: true,
      scripts: {
        start: "node server.js"
      },
      dependencies: {
        express: "^4.18.2"
      }
    };
    fs.writeFileSync(path.join(backendPath, "package.json"), JSON.stringify(pkgJson, null, 2));
  }

  // ---------- Database ----------
  _generateDatabase(project, dbPath) {
    const dbConfig = {
      type: "PostgreSQL",
      host: "localhost",
      port: 5432,
      user: "admin",
      password: "password",
      database: `${project.websiteName.toLowerCase()}_db`
    };

    const schemaSQL = `
-- Schema for ${project.websiteName}
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100)
);
`;
    fs.writeFileSync(path.join(dbPath, "schema.sql"), schemaSQL);
    fs.writeFileSync(path.join(dbPath, "db_config.json"), JSON.stringify(dbConfig, null, 2));
  }

  // ---------- Install & Start ----------
  async _installAndStart(frontendPath, backendPath) {
    console.log(`📦 Installing frontend dependencies...`);
    await this._execCmd("npm install", frontendPath);

    console.log(`📦 Installing backend dependencies...`);
    await this._execCmd("npm install", backendPath);

    console.log("🚀 Starting frontend and backend...");

    // Start backend
    this._execCmd("npm start", backendPath, true);

    // Start frontend
    this._execCmd("npm start", frontendPath, true);

    console.log("🏗️ BuilderAgent: Project is running!");
  }

  _execCmd(cmd, cwd, detached = false) {
    return new Promise((resolve, reject) => {
      const proc = exec(cmd, { cwd, shell: true }, (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ Error running ${cmd} in ${cwd}`, error);
          return reject(error);
        }
        resolve(stdout);
      });

      // Pipe output to console
      proc.stdout?.pipe(process.stdout);
      proc.stderr?.pipe(process.stderr);

      if (detached) proc.unref(); // let process run independently
    });
  }
}

module.exports = { BuilderAgent };
