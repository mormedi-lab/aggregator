import { useEffect } from "react";
import { pingBackend } from "./api";

function App() {
  useEffect(() => {
    pingBackend()
      .then((data) => console.log("Backend says:", data))
      .catch((err) => console.error("Backend error:", err));
  }, []);

  return <div className="p-4 text-xl">Hello from frontend!</div>;
}

export default App;
