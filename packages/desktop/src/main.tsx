import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error("Root element not found");
}

const App = () => <div style={{ height: "100vh", width: "100vw" }} />;

createRoot(rootElement).render(<App />);
