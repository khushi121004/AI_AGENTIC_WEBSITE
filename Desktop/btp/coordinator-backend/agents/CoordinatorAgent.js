const fs = require("fs");
const path = require("path");
const { BuilderAgent } = require("./BuilderAgent");


class CoordinatorAgent {
  constructor() {
    console.log("CoordinatorAgent initialized");
    this.builderAgent = new BuilderAgent();
    this.projects = [];
  }

  async initializeProject({ websiteName, frontend, backend, pages }) {
    const baseDir = path.join(process.cwd(), "project_env");

    // --- Define folder structure ---
    const folders = [
      "frontend",
      "backend/routes",
      "backend/controllers",
      "backend/models",
      "backend/utils",
      "db",
      "agents/builderAgent",
      "agents/optimizerAgent",
      "agents/testerAgent",
      "agents/securityAgent",
      "config",
      "tests"
    ];

    folders.forEach((folder) => {
      fs.mkdirSync(path.join(baseDir, folder), { recursive: true });
    });

    // --- Define metric thresholds ---
    const metrics = {
      performance: { threshold: 85, weight: 0.3 },
      reliability: { threshold: 80, weight: 0.25 },
      security: { threshold: 80, weight: 0.25 },
      scalability: { threshold: 75, weight: 0.2 },
    };

    fs.writeFileSync(
      path.join(baseDir, "config", "metrics.json"),
      JSON.stringify(metrics, null, 2)
    );

    // --- Store metadata ---
    const project = {
      websiteName,
      frontend,
      backend,
      pages,
      timestamp: new Date(),
      status: "initialized",
      structure: folders,
      metrics
    };

    this.projects.push(project);

    console.log(`✅ Project '${websiteName}' initialized with ${frontend}/${backend}`);

    const buildResult = await this.builderAgent.generateBaseArchitecture(project);

    project.buildOutput = buildResult;
    project.status = "architecture_generated";

    console.log(`🏗️ BuilderAgent completed setup for '${websiteName}'`);
    return project;
  }
}

module.exports = { CoordinatorAgent };
