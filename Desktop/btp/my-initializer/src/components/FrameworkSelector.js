import React from "react";

function FrameworkSelector({ frontend, backend, setFrontend, setBackend }) {
  return (
    <div style={styles.selectorContainer}>
      <div>
        <label style={styles.label}>Frontend Framework:</label>
        <select
          value={frontend}
          onChange={(e) => setFrontend(e.target.value)}
          style={styles.select}
        >
          <option>React</option>
          <option>Vue</option>
          <option>Angular</option>
          <option>Svelte</option>
        </select>
      </div>

      <div>
        <label style={styles.label}>Backend Framework:</label>
        <select
          value={backend}
          onChange={(e) => setBackend(e.target.value)}
          style={styles.select}
        >
          <option>Express</option>
          <option>Django</option>
          <option>Flask</option>
          <option>FastAPI</option>
        </select>
      </div>
    </div>
  );
}

const styles = {
  selectorContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    fontWeight: "bold",
    color: "#1e293b",
  },
  select: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
  },
};

export default FrameworkSelector;
