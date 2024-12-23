import React from "react";
import NavigationBar from "./components/Navigations";

function App() {
  return (
    <main className="min-h-screen flex flex-col bg-light text-dark">
      <NavigationBar />
      {/* Other components like About, Features, etc. */}
    </main>
  );
}

export default App;
