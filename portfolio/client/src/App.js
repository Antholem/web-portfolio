import React, { useEffect } from "react";
import { useThemeStore } from "./store/themeStore";
import NavigationBar from "./components/Navigations";

const App = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.body.className = theme === "dark" ? "bg-dark text-light" : "bg-light text-dark";
  }, [theme]);

  return (
    <div className={`${theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"} min-h-screen`}>
      <NavigationBar />
    </div>
  );
};

export default App;
