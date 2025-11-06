const { CoordinatorAgent } = require("./coordinator/CoordinatorAgent");

async function run() {
  const coord = new CoordinatorAgent();
  await coord.startBuild();
}

run().catch(err => {
  console.error("Fatal error:", err);
});