import { useState, useEffect } from "react";
import { treaty } from "@elysiajs/eden";
import type { App as ServerApp } from "@brainwave/server";
import "./App.css";

const client = treaty<ServerApp>("http://localhost:3000");

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    client.get().then((response) => {
      setMessage(response.data ?? "");
    });
  }, []);

  return (
    <>
      <div>
        <h1>{message || "Loading..."}</h1>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  );
}

export default App;
