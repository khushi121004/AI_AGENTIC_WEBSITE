import React from "react";
import InputForm from "./components/InputForm";

function App() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Initializer Agent UI</h1>
      <InputForm />
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: "50px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "2.5rem",
    color: "#1e293b",
    marginBottom: "30px",
  },
};

export default App;
