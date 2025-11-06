import React, { useState } from "react";
import FrameworkSelector from "./FrameworkSelector";

function InputForm() {
  const [websiteName, setWebsiteName] = useState("");
  const [frontend, setFrontend] = useState("React");
  const [backend, setBackend] = useState("Express");
  const [pages, setPages] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = {
      websiteName,
      frontend,
      backend,
      pages: pages.split(",").map((p) => p.trim()),
    };
  
    try {
      const res = await fetch("http://localhost:5000/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      const result = await res.json();
      console.log("✅ Response from CoordinatorAgent:", result);
      alert("Project initialized successfully!");
    } catch (error) {
      console.error("❌ Error sending data:", error);
      alert("Failed to connect to CoordinatorAgent backend.");
    }
  };
  

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <label style={styles.label}>Website Name:</label>
      <input
        type="text"
        placeholder="Enter website name"
        value={websiteName}
        onChange={(e) => setWebsiteName(e.target.value)}
        style={styles.input}
        required
      />

      <FrameworkSelector
        frontend={frontend}
        backend={backend}
        setFrontend={setFrontend}
        setBackend={setBackend}
      />

      <label style={styles.label}>Pages (comma separated):</label>
      <input
        type="text"
        placeholder="Home, About, Contact"
        value={pages}
        onChange={(e) => setPages(e.target.value)}
        style={styles.input}
      />

      <button type="submit" style={styles.button}>
        Initialize Build
      </button>
    </form>
  );
}

const styles = {
  form: {
    width: "400px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  label: {
    fontWeight: "bold",
    color: "#1e293b",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
  },
  button: {
    backgroundColor: "#3b82f6",
    color: "white",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.2s",
  },
};

export default InputForm;
