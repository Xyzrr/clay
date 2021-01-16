import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Clay from "./client/Clay";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Clay id="test"></Clay>
      </header>
    </div>
  );
}

export default App;
