const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { CoordinatorAgent } = require("./agents/CoordinatorAgent");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const coordinator = new CoordinatorAgent();

// Route: handle frontend submissions
app.post("/initialize", async (req, res) => {
  const { websiteName, frontend, backend, pages } = req.body;

  console.log("Received initialization request:", req.body);

  try {
    const result = await coordinator.initializeProject({
      websiteName,
      frontend,
      backend,
      pages,
    });

    res.json({ status: "success", message: "Project initialized!", result });
  } catch (err) {
    console.error("Error initializing project:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Coordinator backend running on http://localhost:${port}`);
});
